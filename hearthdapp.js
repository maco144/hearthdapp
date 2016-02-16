if (Meteor.isClient) {
  Meteor.subscribe('userStatus');
  Meteor.subscribe("config");         //for UI configs with router
  Meteor.subscribe("collect");        //for testing upload from file
  Meteor.subscribe("gametypes");      //the variety of games displayed
  Meteor.subscribe("activeGames");    //The Game Queue

  var lastUser=null;
  Meteor.startup(function(){
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

    // Template.registerHelper("gameSelected", function(){
    //   return Session.get("gameSelected");
    // });

    // Template.registerHelper("gameCollected", function(){
    //   var gs = Session.get("gameSelected");
    //   return ActiveGames.find({gameName: gs});
    // });

    // Template.registerHelper("aMatch", function(){
    //   return ActiveGames.findOne({gameName: Session.get("gameSelected"), "players.name": Meteor.userId()});
    // });

  Template.example.helpers({
    usersOnline:function(){
      return Meteor.users.find({ "status.online": true })
    },
    usersOnlineCount:function(){
   //event a count of users online too.
      return Meteor.users.find({ "status.online": true }).count();
    }
  });

  // Template.matchTeamDisplay.helpers({
  //   'isChecked': function(parentContext){
  //     // var matchId = template.find('#matchId');
  //     console.log("PARENT CONTEXT ISCHECKED");
  //     console.log(parentContext);
  //     console.log(this.name);
  //     var test = ActiveGames.findOne({_id: parentContext._id, "players.name": this.name}, {fields: {"players.readyUp": 1}});
  //     console.log("ewearar"+test.readyUp);
  //     return true;
  //   },
  //   'log': function(){
  //     console.log("CALLLOG");
  //     console.log(this);
  //   }

  // });

  // Template.matchTeamDisplay.events({
  //   'change [type=checkbox]': function(event, template){
  //     var checked = event.currentTarget.checked;
  //     var name = this.name;
  //     var matchId = template.find('#matchId');    
  //     Meteor.call("readySet", matchId.value, name, checked, function(error,result){

  //     });
  //     // var readyUp = {};
  //     // readyUp[name] = checked;
  //     // Session.set("readyUp", readyUp);
  //     // console.log(Session.get("readyUp"));
  //     // if($('.checkem:checked').length == $('.checkem').length){
  //     //   console.log("READUYOO");
  //     // }
  //   }
  // });
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

  Meteor.publish('gametypes', function(){
    return GameTypes.find({});
  });

  Meteor.publish('activeGames', function(){
    return ActiveGames.find({});
  });

  Meteor.methods({
    'userDisconnected': function(lastUser){
      ActiveGames.remove({host: lastUser});
    },

    'createMatch': function(gameSelected, stake, gameDetails){
      var host = this.userId;
      var player = new Player();
      player.set({_id: host, name: host, team: 1, readyUp: true, winner: false});
      var newMatch = new ActiveGame();
      newMatch.set({gameName: gameSelected, host: host, stake: stake, gameDetails: gameDetails});
      newMatch.push('players', player);
      newMatch.save();
      return true;
    },

    'unhostMatch': function(gameSelected){
      var player = ActiveGames.findOne({host: this.userId, gameName: gameSelected});
      player.remove();
      //cant use .save()??? keeps creating new docs
      return true;
    },

    'joinMatch': function(matchId, team){
      var MatchToJoin = ActiveGames.findOne({_id: matchId});
      var dump = MatchToJoin.raw('players');
      //already in check (works?)  if(lodash.has(dump, this.userId)){console.log("well well");}
      if (lodash.isUndefined(lodash.find(dump, {name: this.userId}))){
        var player = new Player();
        player.set({_id: this.userId, name: this.userId, team: team});
        MatchToJoin.push('players', player);
        MatchToJoin.save();
        return true;
      }
      return false;
    },

    'leaveMatch': function(matchId){
      ActiveGames.update({_id: matchId}, { $pull: { "players": { name:this.userId}}});
      return true;
    },

    'readySet': function(matchId, name, checked){
      ActiveGames.update({_id: matchId, "players.name": name}, { $set: { "players.$.readyUp": checked}});
      return true;
    },

    'removeFromAll': function(){
      var player = this.userId;
      return true;
    },

    'userLogout': function(){
      return removeFromAll();
    }
  });
}
/// need to use session.equals to remove unneeded renders of session.get
 