Template.mainlayout.viewmodel({
	inMatchAnywhere: function(){

		return !!ActiveGames.findOne({'players._id': Meteor.userId()});
	}
});