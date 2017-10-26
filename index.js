'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var http = require('http');
var app = express();
var token = process.env.Facebook_TOKEN;
var verify_token = process.env.Verifier_jeton;
app.set('port', (process.env.PORT || 1000));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
app.get('/', function (req, res) {
  res.send('Facebook Bot alors lests go');
});
 
/*
 * (c)Creative commons.
 *  provide by 
 *  www.seed-innov.com
 *
 */
app.get('/webhook', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' && 
		req.query['hub.verify_token'] === verify_token) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("erreur de validation.veuille verifier le token de la page");
    res.sendStatus(403);
  }
});
 

 /*Fonction appelée par facebook lorqqu'un evenement auquel nous sommes enregistré se produit.
 En cas de latence, plusieurs message peuvent arriver 
 il faut les récuperer un par un et les traiter dans une boucle*/
 
app.post('/webhook', function (req, res) {
	
  var data = req.body;
  if (data.object == 'page') {
    data.entry.forEach(function (pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;
      pageEntry.messaging.forEach(function (event) {
        if (event.message && event.message.text) {
          receivedMessage(event);
        }
      });
    });
    res.sendStatus(200);
  }
});

 
function receivedMessage(event) {
  var senderID = event.sender.id; //lid du tipe qui a envoille le message
  var recipientID = event.recipient.id; //lid du message 
  var timeOfMessage = event.timestamp; //temps du message qui a ete envoyer
  var message = event.message.text; //message qui a ete envoille
 let text = event.message.text
            text = text || "";
			//cree un event qui va verifier et rependre + base de donne json 
					var messageText = "Hello Seed";
					var messageData = {
						recipient: { id: senderID },
						message: { text: messageText }
					};
					//envoie du message 
					callSendAPI(messageData);
         
  
}
 
function callSendAPI(messageData) {
	//request de http de type post et non put
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token},
    method: "POST",
    json: messageData
 
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;
	  //si lenvoie du message a reussi 
      console.log("message a ete envoyer avec sucsse avec l'id %s to recipient %s", messageId, recipientId);
    } else {
		//si il a pas put
      console.error("pas ous envouille le message");
      console.error(response);
      console.error(error);
    }
  });
}
 
 //donc quelle port il marche
app.listen(app.get('port'), function () {
  console.log('marche dans le port', app.get('port'));
})
