if (Meteor.isClient) {
  Meteor.subscribe('userStatus');
  Meteor.subscribe("players");        //players who have queued
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

    Template.registerHelper("hosting", function(){
      var gs = Session.get("gameSelected");
      return ActiveGames.findOne({host: Meteor.userId(), gameName: gs});
    });

    Template.registerHelper("gameSelected", function(){
      return Session.get("gameSelected");
    });

    Template.registerHelper("gameCollected", function(){
      var gs = Session.get("gameSelected");
      return ActiveGames.find({gameName: gs});
    });

    Template.hostMatch.events({
      'click [data-action="modal"]': function(){
        SemanticModal.generalModal('hostMatchModal',{}, {modalClass: "ui modal small", id:"matchmodal"});
      }
    });

    Template.hostActiveGame.events({
      'click #matchCreate': function(event){
        event.preventDefault();
        var stake = $('#matchStake').val();
        var gameDetails = ({
          winning: $('#matchTeam').val(),
          achieved: $('#matchAchieved').val(),
          objective: $('#matchObjective').val()
        });
        Meteor.call("createMatch", Session.get("gameSelected"), stake, gameDetails, function(error,result){
            //error catch needed
        });
      }
    });
    
    Template.matchChannel.events({
      'click #unhostMatch': function(event){
        event.preventDefault();
        Meteor.call('unhostMatch', Session.get("gameSelected"), function(error,result){
            //error checking
        });
      },
      'click #unregister': function(event){
        event.preventDefault();
        Meteor.call('removeFromQ', Session.get("gameSelected"), function(error,result){
          if(result){
            Session.set("hosting", false);
          }
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

  //choosing/setting the current active game to display 
  Template.gamesFooter.events({
    'click .item': function(event){
      event.preventDefault();
      var gameSelected = this.gamename;
      Session.set("gameSelected",gameSelected);
    }
  });

  //how a challenger approves a match
  Template.joinMatchForm.events({
    'click submit': function(event){
      event.preventDefault();
      Meteor.call("joinMatch",matchId, team);
    }
  });

  //need to find actual ActiveGame by _id
  Template.joinMatchModal.helpers({
    'aMatch': function(){
      return ActiveGames.findOne({_id: Session.get("_matchId")});
    }
  });

  Template.gamesFooter.helpers({
    'gametypes': function(){
      return GameTypes.find({});
    }
  });


  Template.activegames.events({
    'click .item': function(event){
      var self = this;
      SemanticModal.generalModal('joinMatchModal',{}, {modalClass: "ui modal", id:"joinMatchmModal"});
      Session.set("_matchId", this._id);
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
      player.set({name: host, team: 1});
      player.save();
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
      var MatchToJoin = ActiveGames.findOne({_id: matchid});
      var player = new Player();
      player.set({name: this.userId, team: team});
      player.save();
      MatchToJoin.push('players', player);
      MatchToJoin.save();
      return true;
    },

    'leaveMatch': function(matchId){
      var player = ActiveGames.findOne({_id: matchId, name: this.userId});
      player.remove();
      return true;
    },

    'removeFromAll': function(gameSelected){
      var player = this.userId;
      ActiveGames.remove(player);
      return true;
    },

    'userLogout': function(){
      return removeFromAll();
    }
  });
}
/// need to use session.equals to remove unneeded renders of session.get
