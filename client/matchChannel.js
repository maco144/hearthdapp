Template.matchChannel.viewmodel({
	share: ['gameSelected', 'matchID'],
	// onCreated: function(){
	// 	// var match = ActiveGames.findOne({gameName: this.gameSelected(), "players.name": this.userId});
	// 	// this.matchID(match._id);
	// },
	unhostMatch: function(){
		Meteor.call('unhostMatch', this.matchID(), function(error,result){
            //error checking
        });
	},
	leaveMatch: function(){
		Meteor.call('leaveMatch', this.matchID(), function(error,result){

        });
	},
	aMatch: function(){
		var match = ActiveGames.findOne({gameName: this.gameSelected(), "players._id": Meteor.userId()});
		this.matchID(match._id);
		return match;
	},
	log: function(){
		console.log(this);
	}
});
