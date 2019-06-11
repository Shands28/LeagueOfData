'use strict'
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	username: {
		type: String
	},
	email: {
		type: String
	},
	password: {
		type: String
	},
	userIconId: {
		type: Number
	},
	savedAccounts: {
		type: [JSON]
	},
	linkedAccounts: {
		type: [JSON]
    },
    creationDate: {
        type: Date
    }
	
}, {versionKey: false});

module.exports = mongoose.model('User', UserSchema);