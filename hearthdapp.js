if (Meteor.isClient) {
  Meteor.subscribe('userStatus');
  // Meteor.subscribe("players");        //players who have queued
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

    Template.registerHelper("inMatchLobby", function(){
      var gs = Session.get("gameSelected");
      var test = ActiveGames.findOne({gameName: gs, 'players.name': Meteor.userId()});
      return (test) ? true: false;
    });

    Template.registerHelper("gameSelected", function(){
      return Session.get("gameSelected");
    });

    Template.registerHelper("gameCollected", function(){
      var gs = Session.get("gameSelected");
      return ActiveGames.find({gameName: gs});
    });

    Template.registerHelper("aMatch", function(){
      return ActiveGames.findOne({gameName: Session.get("gameSelected"), "players.name": Meteor.userId()});
    });

    Template.hostMatch.events({
      'click [data-action="modal"]': function(){
        SemanticModal.generalModal('hostMatchModal',{}, {modalClass: "ui modal small", id:"matchmodal"});
      }
    });

    Template.hostActiveGame.onRendered( function(){
      document.getElementById("teamshidden").style.display="none";
    });

    Template.hostActiveGame.events({
      'click #matchCreate': function(event){
        event.preventDefault();
        var stake = $('#matchStake').val();
        var gameDetails = ({
          winning: $('#matchTeam').val(),
          achieved: $('#matchAchieved').val(),
          objective: $('#matchObjective').val(),
          teamsNumber: $('#matchTeamNumber').val(),
          teamSize: $('#matchPlayersAside').val()
        });
        Meteor.call("createMatch", Session.get("gameSelected"), stake, gameDetails, function(error,result){
            if(result){ //need error checking still, this to close modal
               $('#generalModal').modal('hide');  
            }
        });
      },
      'change #matchTeam': function(event){
        var matchTeam = event.currentTarget.value;
          if(matchTeam === "solo") document.getElementById('teamshidden').style.display="none";
          else if (matchTeam === "team") {document.getElementById("teamshidden").style.display="block";}
          else{}
      }
    });

    
    Template.matchChannel.events({
      'click #unhostMatch': function(event){
        event.preventDefault();
        Meteor.call('unhostMatch', Session.get("gameSelected"), function(error,result){
            //error checking
        });
      },
      'click #leaveMatch': function(event, template){
        event.preventDefault();
        console.log(template);
        var matchId = template.find('#matchId');
        Meteor.call('leaveMatch', matchId.value, function(error,result){

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

  //choosing/setting the current active game to display 
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
  });


  Template.gameJoinDim.onRendered( function(){
    var teamnum = this.data.gameDetails.teamsNumber
    var loc = document.getElementById("joinMatchButtons");
    for(i=1; i <= teamnum;i++){
      var newButton = document.createElement("BUTTON");
      newButton.setAttribute("value", i);
      var t = document.createTextNode("Team " + i);
      newButton.appendChild(t);
      loc.appendChild(newButton);
    }
  });

  Template.gameJoinDim.events({
    'click #joinMatchButtons': function(event){
      event.preventDefault();
      var team = event.target.value;
      Meteor.call("joinMatch", this._id, team, function(error,result){

      });
    }
  });

  Template.activegames.events({
    // 'click .item': function(event){  
    //   Session.set("_matchId", this._id);
    //   SemanticModal.generalModal('joinMatchModal',{}, {modalClass: "ui modal", id:"joinMatchmModal"});
    // },
    // 'click #joinMatchButton': function(event){
    //   event.preventDefault();
    //   var team = event.target.value;
    //   Meteor.call("joinMatch",this._id, 2, function(error,result){
    //     if(result) {
    //       $('#generalModal').modal('hide'); 
    //     } 
    //   });
    // },
    'mouseover .ui.card': function(){
      $('.ui.card').dimmer('show');
    },
    'mouseleave .ui.card': function(){
      $('.ui.card').dimmer('hide');
    }
  });

  Template.matchTeamDisplay.helpers({
    'isChecked': function(parentContext){
      // var matchId = template.find('#matchId');
      console.log("PARENT CONTEXT ISCHECKED");
      console.log(parentContext);
      // ActiveGames.findOne({_id: matchId});
      return true;
    },
    'log': function(){
      console.log(this);
    }

  });

  Template.matchTeamDisplay.events({
    'change [type=checkbox]': function(event, template){
      var checked = event.currentTarget.checked;
      var name = this.name;
      var matchId = template.find('#matchId');    
      Meteor.call("readySet", matchId.value, name, checked, function(error,result){

      });
      // var readyUp = {};
      // readyUp[name] = checked;
      // Session.set("readyUp", readyUp);
      // console.log(Session.get("readyUp"));
      // if($('.checkem:checked').length == $('.checkem').length){
      //   console.log("READUYOO");
      // }
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
        player.set({name: this.userId, team: team});
        MatchToJoin.push('players', player);
        MatchToJoin.save();
      }
      return true;
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
 