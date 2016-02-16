Template.matchChannel.viewmodel({
	share: ['gameSelected', 'matchID'],
	_id: '',
	name: '',
	winner: '',
	readyUp: '',
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
		var aMatch = ActiveGames.findOne({gameName: this.gameSelected(), "players.name": Meteor.userId()});
		this.matchID(aMatch._id);
		return aMatch;
	},
});
