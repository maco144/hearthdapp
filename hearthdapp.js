Players = new Mongo.Collection('players');
GameRequest = new Mongo.Collection('gamerequest');
Config = new Mongo.Collection('config');


if (Meteor.isClient) {
  Meteor.subscribe('userStatus');
  Meteor.subscribe("players");
  Meteor.subscribe("gameRequests");
  Meteor.subscribe("config");

  var lastUser=null;
  Meteor.startup(function(){
    //autorun function for tracking login/logout
    Tracker.autorun(function(){
        var userId=Meteor.userId();
        if(userId){
            console.log(userId+" connected");
        }
        else if(lastUser){
            console.log(lastUser._id+" disconnected");
            // can't use Meteor.user() anymore
            // do something with lastUser (read-only !)
            Meteor.call("userDisconnected",lastUser._id);
        }
        lastUser=Meteor.user();
    });
  });

    Template.addPlayerForm.events({
    'submit form': function(event){
      event.preventDefault();
      var player = Meteor.userId();
      var wager = Number(event.target.wager.value);
      Meteor.call('insertToQ', player, wager);
    },
    'click #unregister': function(event){
      event.preventDefault();
      var player = Meteor.userId();
      Meteor.call('removeFromQ', player);
    }
  });

  Template.example.helpers({
    usersOnline:function(){
      return Meteor.users.find({ "status.online": true })
    },
    usersOnlineCount:function(){
   //event a count of users online too.
      return Meteor.users.find({ "status.online": true }).count();
    }
  });

  //for autoform 
  Template.profile.helpers({
    users: function () {
      return Meteor.users;
    },
    userSchema: function () {
      return Schema.User;
    },
    'typeAction': function(){
      var a = "insert";
       if(Meteor.users.findOne({_id: Meteor.userId()}))
            a = "update";
       return a;
   },
    'current': function(){
      var ID = Meteor.users.findOne({_id: Meteor.userId()});
      return ID;
    }
  });

  Template.activeq.helpers({
    'players': function(){
      return Players.find({}, {sort: {stake: -1, name: 1}});
    }
  });

  Template.activeq.events({
    //challenge opponent by selecting them
    'click .player': function(){
      var playerChallenged = this.name;
      var playerChallenger = Meteor.userId();
      var wager = this.stake;
      if(playerChallenger != playerChallenged){
       Meteor.call('requestGame', playerChallenger, playerChallenged, wager);
      } 
    }
  });

  Template.gameRequests.helpers({
    'gameRequests': function() {
      return GameRequest.find({});
    }
  });

  Template.mainlayout.helpers({
    'config': function() {
      return Config.findOne({});
    }
  });

  Template.signin.helpers({
    'config': function() {
      return Config.findOne({});
    }
  });

  Template.register.helpers({
    'config': function() {
      return Config.findOne({});
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Config.remove({});

    Config.insert({
        application       : 'GameGames',
        allowSignin       : true,
        allowSignup       : true,
        allowDeleteAccount: true,
        allowUploadAvatar : false,
        enableEvents      : false
    });
  });
  Meteor.publish('players', function(){
      return Players.find({}, {sort: {stake: -1, name: 1}});
  });

  Meteor.publish('userStatus', function() {
    return Meteor.users.find({ "status.online": true });
  });

  Meteor.publish('gameRequests', function() {
    return GameRequest.find({});
    // return GameRequest.find({$or: [
     //   { playerChallenger: Meteor.userId() }, 
     //   { playerChallenged: Meteor.userId() }
     // ]});
  });

  Meteor.publish('config',function(){
    return Config.find({});
  });

  Meteor.methods({
    'insertToQ': function(player, wager){
      var currentUserId = player;
      Players.update({ name: currentUserId }, { $setOnInsert: { name: currentUserId, stake: wager } }, { upsert: true } ); 
    },

    'userDisconnected': function(lastUser){
      Players.remove({name: lastUser});
    },

    'removeFromQ': function(player){
      Players.remove({name: player});
    },

    'userLogout': function(){
      return removeFromQ();
    },

    'requestGame': function(playerChallenger, playerChallenged, wager){
      if(playerChallenger != playerChallenged){
        GameRequest.insert({
          player: playerChallenger,
          challenged: playerChallenged,
          wager: wager,
          time: Date.now(),
          started: false,
          finished: false
        });
        Meteor.call('removeFromQ', playerChallenged);
        Meteor.call('removeFromQ', playerChallenger);
      }
    }
  });
}
