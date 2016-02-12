Template.matchChannel.viewmodel({
	share: ['gameSelected', 'matchID'],
	unhostMatch: function(){
		Meteor.call('unhostMatch', this.gameSelected(), function(error,result){
            //error checking
        });
	},
	leaveMatch: function(){
		Meteor.call('leaveMatch', this.matchID(), function(error,result){

        });
	}
});