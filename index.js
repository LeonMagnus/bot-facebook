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
const token=process.env.Facebook_TOKEN;
//teste la connection avec la page facebook
app.set('port',token);
app.get('/', function (req, res) {
	res.send('salut les amie');
});
//pour verifier
app.get('/webhook', function (req, res) {
	if (req.query['hub.verify_token'] ===process.env.Verifier_jeton) {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token');
})
