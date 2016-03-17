Config = new Mongo.Collection('config');
GameTypes = new Mongo.Collection('gametypes');

GameRule = Astro.Class({
	name: 'GameRule',
	fields: {
		rule: 'string',
		validator: 'string',
	}
});

GameType = Astro.Class({
	name: 'GameType',
	collection: GameTypes,
	fields: {
		gameName: 'string',
		gameRules: {
			type: 'array',
			nested: 'GameRule',
			default() {
				return [];
			}
		},
		maxTeams: 'number',
		maxPlayers: 'number',
	}
});