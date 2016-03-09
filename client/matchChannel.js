Template.matchChannel.viewmodel({
	share: ['gameSelected', 'matchID'],

	onRendered: function(template){
			template.subscribe('matchInfo', this.matchID());
	},
		
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
		console.log(this.matchID());
		return ActiveGames.findOne({_id: this.matchID()});
	},
});
