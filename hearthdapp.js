if (Meteor.isClient) {
  Meteor.subscribe('userStatus');
  Meteor.subscribe("players");        //players who have queued
  Meteor.subscribe("gameRequests");   //when a match is set up
  Meteor.subscribe("config");         //for UI configs with router
  Meteor.subscribe("collect");        //for testing upload from file
  Meteor.subscribe("match");          //details of match type created by host

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
    
    Template.registerHelper("config", function(){
      return Config.findOne({});
    });

    Template.registerHelper("current", function(){
      return Meteor.users.findOne({_id: Meteor.userId()});
    });

    Template.registerHelper("hosting", function(){
      return Match.findOne({host: Meteor.userId()});
    });

    Template.hostMatch.events({
      'click [data-action="modal"]': function(){
        SemanticModal.generalModal('hostMatchModal',{}, {modalClass: "ui modal small", id:"matchmodal"});
      }
    });

    Template.matchChannel.events({
      'click #unregister': function(event){
        event.preventDefault();
        Meteor.call('removeFromQ');
    }
    });

    // Template.addPlayerForm.events({
    // 'submit form': function(event){
    //   event.preventDefault();
    //   var wager = Number(event.target.wager.value);
    //   Meteor.call('insertToQ', wager);
    // },
    // 'click #join': function(event){
    //   console.log("submit button click" + event.target + event.name );
    //   event.preventDefault();
    //   var player = Meteor.userId();
    //   var wager = Number(event.target.wager.value);
    //   Meteor.call('insertToQ', player, wager);
    // },
    // 'click #unregister': function(event){
    //   event.preventDefault();
    //   Meteor.call('removeFromQ');
    // }
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

  Template.games.helpers({
    'host': function() {
      return Match.findOne({host: Meteor.userId()});
    }
  })

  Template.activeq.helpers({
    // 'players': function(){
    //   return Players.find({}, {sort: {stake: -1, name: 1}});
    // }
      'match': function(){
        return Match.find({}, {sort: {game: 1, stake: -1}});
      }
  });

  // Template.activeq.events({
  //   //challenge opponent by selecting them
  //   // 'click .player': function(){
  //   //   var playerChallenged = this.name;
  //   //   var playerChallenger = Meteor.userId();
  //   //   var wager = this.stake;
  //   //   if(playerChallenger != playerChallenged){
  //   //    Meteor.call('requestGame', playerChallenger, playerChallenged, wager);
  //   //   } 
  //   //   }
  //   //   });

  Template.gameRequests.helpers({
    'gameRequests': function() {
      return GameRequest.find({});
    }
  });


//for testing. currently file upload to a collection
  // Template.main.events({
  // 'submit': function(event, template){
  //   event.preventDefault();
  //   if (window.File && window.FileReader && window.FileList && window.Blob) {
  //     _.each(template.find('#files').files, function(file) {
  //       if(file.size > 1){
  //         var reader = new FileReader();
  //         reader.onload = function(event) {
  //           Collect.insert({
  //             name: file.name,
  //             type: file.type,
  //             dataUrl: reader.result
  //           });
  //         }
  //         reader.readAsDataURL(file);
  //       }
  //     });
  //   }
  //   }
  //   });
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

  Meteor.publish('collect',function(){
    return Collect.find({});
  });

  Meteor.publish('match', function(){
    return Match.find({});
  });

  Meteor.methods({
    // 'insertToQ': function( wager){
    //   var currentUserId = this.userId;
    //   Players.update({ name: currentUserId }, { $setOnInsert: { name: currentUserId, stake: wager } }, { upsert: true } ); 
    // },

    'userDisconnected': function(lastUser){
      Players.remove({name: lastUser});
    },

    'removeFromQ': function(){
      var player = this.userId;
      Match.remove({host: player});
    },

    'userLogout': function(){
      return removeFromQ();
    },

    // 'requestGame': function(playerChallenger, playerChallenged, wager){
    //   if(playerChallenger != playerChallenged){
    //     GameRequest.insert({
    //       player: playerChallenger,
    //       challenged: playerChallenged,
    //       wager: wager,
    //       time: Date.now(),
    //       started: false,
    //       finished: false
    //     });
    //     Meteor.call('removeFromQ', playerChallenged);
    //     Meteor.call('removeFromQ', playerChallenger);
    //   }
    // }
  });
}
