'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SummonerSchema = Schema({
	profileIconId: {
		type: Number
	},
	summonerName: {
		type: String
	},
	ranks: {
		type: Array
	},
	region: {
		type: String
	},
	summonerLevel: {
			type: Number
	},
	id: {
		type: String
	},
	accountId: {
		type: String
	},
	foundMatches: {
		type: Array
	}
}, {versionKey: false});

module.exports = mongoose.model('Summoner', SummonerSchema);