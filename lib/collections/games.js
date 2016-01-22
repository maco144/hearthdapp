// GameRules = new Mongo.Collection('gameRules');

// GameRule = Astro.Class({
// 	name: 'GameRule',
// 	collection: GameRules,
// 	fields: {
// 		winning: 'string',
// 		achieved: 'string',
// 		objective: 'string',
// 		causeWin: {
// 			type: 'boolean',
// 			default: true
// 		}
// 	}
// });

// GameInfos = new Mongo.Collection('gameInfos');

// GameInfo = Astro.Class({
// 	name: 'GameInfo',
// 	collection: GameInfos,
// 	fields: {
// 		gameName: 'string',
// 		rule: {
// 			type: 'array',
// 			nested: "GameRule",
// 			default() {
// 				return [];
// 			}
// 		}
// 	}
// });

Players = new Mongo.Collection('players');

Player = Astro.Class({
	name: 'Player', // singular
	collection: Players,
	fields: {
		name: {
			type: 'string',
			validator: Validators.unique()
		},
		createdAt: 'date',
		team: 'number',
		readyUp: {
			type: 'boolean',
			default: false
		},
		winner: {
			type: 'boolean',
			default: false
		}
	},
	events: {
		beforeInsert() {
			this.createdAt = new Date();
		}
	},
	methods: {
		makeWinner() {
			this.winner = true;
		}
	}
});


ActiveGames = new Mongo.Collection('activeGames');

ActiveGame = Astro.Class({
	name: 'ActiveGame',
	collection: ActiveGames,
	fields: {
		gameName: 'string',
		host: 'string',
		stake: 'number',
		gameDetails: 'object',
		causeWin: {
			type: 'boolean',
			default: true
		},
		startedAt: 'date',
		players: {
			type: 'array',
			nested: 'Player',
			default() {
				return [];
			},
			validator: Validators.unique('name not unique')
		}
	},
	events: {
		beforeInsert() {
			this.startedAt = new Date();
		}
	},
	methods: {
		addPlayer(player) {
			this.push('players', player);
		},
		gameRules(){

			var rule = "The "+this.gameDetails.winning+" with the " + this.gameDetails.achieved + " " + this.gameDetails.objective + " will win if true=" + this.causeWin;
			return rule;
		}
		
	}
});
