NewGameTypes = new Mongo.Collection('newGameTypes');

NewGameType = Astro.Class({
	name: 'GameType',
	collection: NewGameTypes,
	fields: {
		gameType: 'string',
		maxPlayers: 'number'
	}
});
