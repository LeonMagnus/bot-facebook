'use strict'
//inmporte les bib besoin
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
//recupe les donne
const info = require("./info.json");
//teste la connection avec la page facebook
app.set('port', info.token);
app.get('/', function (req, res) {
	res.send('salut les amie');
});
//pour verifier
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})