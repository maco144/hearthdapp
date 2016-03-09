if (Meteor.isClient) {
  Meteor.subscribe('userStatus');
  Meteor.subscribe("config");         //for UI configs with router
  Meteor.subscribe("collect");        //for testing upload from file
  Meteor.subscribe("gametypes");      //the variety of games displayed

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
    GameTypes.insert({gameName: 'Warsow'}); 
    GameTypes.insert({gameName: 'Newerth'}); 
    GameTypes.insert({gameName: 'Other'}); 
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

  Meteor.publish('activeGames', function(game){
    return ActiveGames.find({gameName: game});
  });

  Meteor.publish('gamesIn', function(){
    return ActiveGames.find({'players._id': this.userId})
  });

  Meteor.publish('matchInfo', function(aMatch){
    return ActiveGames.find({_id: aMatch});
  });

  Meteor.methods({
    'userDisconnected': function(lastUser){
      ActiveGames.remove({host: lastUser});
    },

    'createMatch': function(gameSelected, stake, gameDetails){
      var newMatch = new ActiveGame();
      newMatch.set({gameName: gameSelected, host: this.userId, stake: stake, gameDetails: gameDetails});
      if(newMatch.validate()){
        newMatch.save();
        Meteor.call('joinMatch',newMatch.get('_id'),1); //add host to game
        return true;
      }
      console.log(newMatch.getValidationErrors());
      return false;
    },

    'joinMatch': function(matchId, team){
      var MatchToJoin = ActiveGames.findOne({_id: matchId});
      var dump = MatchToJoin.raw('players');
      //already in check (works?)  if(lodash.has(dump, this.userId)){console.log("well well");}
      if (lodash.isUndefined(lodash.find(dump, {_id: this.userId}))){
        var player = new Player();
        player.set({_id: this.userId, team: team});
        MatchToJoin.push('players', player);
        if(MatchToJoin.validate()){
          MatchToJoin.save();
          return true;
        }
        console.log(MatchToJoin.getValidationErrors());
        return false
      }
      return false;
    },

    'unhostMatch': function(matchId){
      var player = ActiveGames.findOne({_id: matchId});
      player.remove();
      //cant use .save()??? keeps creating new docs
      return true;
    },

    'leaveMatch': function(matchId){
      ActiveGames.update({_id: matchId}, { $pull: { "players": { _id: this.userId}}});
      return true;
    },

    'readySet': function(matchId, checked){
      ActiveGames.update({_id: matchId, "players._id": this.userId}, { $set: { "players.$.readyUp": checked}});
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