Template.gameChoices.viewmodel({
	share: 'gameSelected',

	gametypes: function(){
		return GameTypes.find({}, {fields: {'gameName':1}});
	},
});