Template.games.viewmodel({
	share: 'gameSelected',

	hostingMatch: function(){
		return !!ActiveGames.findOne({host: Meteor.userId(), gameName: this.gameSelected()});
	},
	playingMatch: function(){
		return !!ActiveGames.findOne({gameName: this.gameSelected(), 'players.name': Meteor.userId()});
	},
	inMatchChannel: function(){
		return (this.hostingMatch() || this.playingMatch());
	}
});