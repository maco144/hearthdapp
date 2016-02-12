Template.hostMatchSetup.viewmodel({
	share: 'gameSelected',
	selectTeam: 'solo',
	matchTeam: [
		{ id: 'solo', name: "Solo"},
		{ id: 'team', name: "Team"}
		],
	selectAchieved: 'most',
	matchAchieved: [
		{ id: 'most', name: "Most"},
		{ id: 'least', name: "Least"}
		],
	selectObjective: 'points',
	matchObjective: [
		{ id: 'points', name: "Points"},
		{ id: 'kills', name: "Kills"},
		{ id: 'deaths', name: "Deaths"}
		],
	isTeamGame: function(){
		return (this.selectTeam()==='team') ? true: false;
	},
	gameDetails: function(){
		var gameDetails = ({
          winning: this.selectTeam(),
          achieved: this.selectAchieved(),
          objective: this.selectObjective(),
          teamsNumber: this.matchTeamNumber.value(),
          teamSize: this.matchPlayersAside.value()
        });
   		return gameDetails;
	},
	matchCreate: function(){
        Meteor.call("createMatch", this.gameSelected(), this.matchStake.value(), this.gameDetails(), function(error,result){
            if(result){ //need error checking still, this to close modal
               $('#generalModal').modal('hide');  
            }
        });
	}
});

Template.uiNumber.viewmodel({
	visible: true,
	label: '',
	min: 0,
	max: 0,
	value: 0
});