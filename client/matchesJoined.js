Template.matchesJoined.viewmodel({
	share: 'matchID',
	onCreated: function(template){
		template.subscribe('gamesIn');
	},
	gamesIn: function(){
		return ActiveGames.find({"players._id": Meteor.userId()});
	}
});