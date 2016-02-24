Config = new Mongo.Collection('config');
GameTypes = new Mongo.Collection('gametypes');

GameType = Astro.Class({
	name: 'GameType',
	collection: GameTypes,
	fields: {
		gameName: 'string',
		gameRule: {
			type: 'array',
			default() {
				return [];
			}
		},
		maxTeams: 'number',
		maxPlayers: 'number',
	}
})