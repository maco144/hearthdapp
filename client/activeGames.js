Template.activeGames.viewmodel({
	share: 'gameSelected',
	hovering: false,
	gameCollection: function(){
		return ActiveGames.find({gameName: this.gameSelected()});
	},
});

Template.gameJoinDim.viewmodel({
	share: 'matchID',
	teams: function(){
		var teamarray = [];
		for(var i=1; i<= this.gameDetails().teamsNumber; i++){
			teamarray.push(i);
		}
		return teamarray;
	},
	joinMatchButton: function(value){
		this.matchID(this._id());
		Meteor.call("joinMatch", this.matchID(), value, function(error,result){

		});
	},
});

ViewModel.addBinding({
	name: 'dimmer',
	autorun: function(bindArg){
		dimmer = bindArg.getVmValue();
		if (dimmer){
			bindArg.element.dimmer('show');
		} else {
			bindArg.element.dimmer('hide');
		}
	}
});