Players = new Mongo.Collection('players');

Player = Astro.Class({
	name: 'Player', // singular
	collection: Players,
	fields: {
		name: 'string',
		createdAt: 'date',
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
		gameTypeId: 'string',
		startedAt: 'date',
		players: {
			type: 'array',
			nested: 'Player',
			default() {
				return [];
			}
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
		}
	}
});
