if (Meteor.isClient) {
  Meteor.subscribe('userStatus');
  Meteor.subscribe("players");        //players who have queued
  Meteor.subscribe("gameRequests");   //when a match is set up
  Meteor.subscribe("config");         //for UI configs with router
  Meteor.subscribe("collect");        //for testing upload from file
  Meteor.subscribe("match");          //details of match type created by host
  Meteor.subscribe("gametypes");      //the variety of games displayed
  Meteor.subscribe("newerth");
  Meteor.subscribe("warsow");

  var lastUser=null;
  Meteor.startup(function(){
    // Session.setDefault("hosting", false);
    // Session.setDefault("gameSelected", "Warsow");
    //autorun function for tracking login/logout
    Tracker.autorun(function(){
        var userId=Meteor.userId();
        if(userId){
            console.log(userId+" connected");
        }
        else if(lastUser){
            console.log(lastUser+" disconnected");
            // can't use Meteor.user() anymore
            // do something with lastUser (read-only !)
            Meteor.call("userDisconnected",lastUser);
        }
        lastUser=Meteor.userId();
    });
  });
    
    Template.registerHelper("config", function(){
      return Config.findOne({});
    });

    Template.registerHelper("current", function(){
      return Meteor.users.findOne({_id: Meteor.userId()});
    });

    Template.registerHelper("hosting", function(){
      return Session.get("hosting");
    });

    Template.registerHelper("gameSelected", function(){
      return Session.get("gameSelected");
    });

    Template.registerHelper("gameToCollection", function(){
      var gs = Session.get("gameSelected");
      return Mongo.Collection.get(gs.toLowerCase()).find({});
    });

    Template.hostMatch.events({
      'click [data-action="modal"]': function(){
        SemanticModal.generalModal('hostMatchModal',{}, {modalClass: "ui modal small", id:"matchmodal"});
      }
    });

    //currently broken cant pass the needed collection
    Template.matchChannel.events({
      'click #unregister': function(event){
        event.preventDefault();
        Meteor.call('removeFromQ', Session.get("gameSelected"), function(error,result){
          if(result)
            Session.set("hosting", false);
        });
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
   }
  });

  Template.gamesFooter.events({
    'click .item': function(event){
      event.preventDefault();
      var gameSelected = this.gamename;
      Session.set("gameSelected",gameSelected);
    }
  });

  Template.gamesFooter.helpers({
    'gametypes': function(){
      return GameTypes.find({});
    }
  })

  Template.activeq.helpers({
    // 'players': function(){
    //   return Players.find({}, {sort: {stake: -1, name: 1}});
    // }
      // 'match': function(){
      //   return Match.find({}, {sort: {game: 1, stake: -1}});
      // }
      'match': function(){
        var gs = Session.get("gameSelected");
        return Mongo.Collection.get(gs.toLowerCase()).find({});
      //   var gs = Session.get("gameSelected");
      //   return Mongo.Collection.get(gs).find({},{sort: {stake: -1}});
      },
      'gameToCollection': function(){
        var gs = Session.get("gameSelected");
        return Mongo.Collection.get(gs.toLowerCase()).find({});
      }
  });

  Template.activeq.events({
      'click .item': function(event, template){
        SemanticModal.generalModal('joinMatchModal',{}, {modalClass: "ui modal small", id:"joinmatchmodal"});
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

    GameTypes.remove({});
    GameTypes.insert({gamename: 'Warsow'}); 
    GameTypes.insert({gamename: 'Newerth'}); 
    GameTypes.insert({gamename: 'Other'}); 
  });


  Meteor.publish('userStatus', function() {
    return Meteor.users.find({ "status.online": true });
  });

  Meteor.publish('config',function(){
    return Config.find({});
  });

  Meteor.publish('collect',function(){
    return Collect.find({});
  });

  Meteor.publish('match', function(){
    return Match.find({});
  });

  Meteor.publish('gametypes', function(){
    return GameTypes.find({});
  });

  Meteor.publish('newerth', function(){
    return Newerth.find({});
  });  

  Meteor.publish('warsow', function(){
    return Warsow.find({});
  });

  Meteor.methods({
    'userDisconnected': function(lastUser){
      Match.remove({host: lastUser});
    },

    'removeFromQ': function(gameSelected){
      var player = this.userId;
      var gs = gameSelected.toLowerCase();
      Mongo.Collection.get(gs).remove({host: player});
      return true;
    },

    'userLogout': function(){
      return removeFromQ();
    }
  });
}
