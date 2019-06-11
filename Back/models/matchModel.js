'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MatchSchema = Schema({
	seasonId: {
		type: Number
	},
	queueId: {
		type: Number
	},
	gameId: {
		type: Number
	},
	participantIdentities: {
		type: Array
	},
	gameVersion: {
		type: String
	},
	platformId: {
		type: String
	},
	gameMode: {
		type: String
	},
	mapId: {
		type: Number
	},
	gameType: {
		type: String
	},
	teams: {
		type: Array
	},
	participants: {
		type: Array
	},
	gameDuration: {
		type: Number
	},
	gameCreation: {
		type: Number
	}
}, {versionKey: false});

module.exports = mongoose.model('Match', MatchSchema);