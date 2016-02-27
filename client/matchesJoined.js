Template.matchesJoined.viewmodel({
	share: 'matchID',
	onCreated: function(template){
		var that = this;
		console.log(that);
		console.log("that^ templatebelow");
		console.log(template);
		template.subscribe('gamesIn');
	},
	gamesIn: function(){
		return ActiveGames.find({"players._id": Meteor.userId()});
	}
});