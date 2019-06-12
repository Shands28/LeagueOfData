'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoticiaSchema = Schema({
	title: {
		type: String
	},
	description: {
		type: String
	},
	body: {
		type: String
	},
	publicationDate: {
		type: Date
	},
	img: {
		type: String
	}
}, {versionKey: false});

module.exports = mongoose.model('News', NoticiaSchema);
