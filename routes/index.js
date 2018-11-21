'use strict';
const express = require('express');
const router = express.Router();

// initialize the Fitbit API client
const FitbitApiClient = require("fitbit-node");
const client = new FitbitApiClient({
    clientId: "22D65N",
    clientSecret: "304e066e1fa649363840c74ac75a6342",
    apiVersion: '1.2' // 1.2 is the default
});

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});


/* Oauth shit */
router.get('/authorize', function (req, res) {
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://localhost:1337/fitbit-api-javascript'));
});

// handle the callback from the Fitbit authorization flow
router.get("/fitbit-api-javascript", (req, res) => {
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, 'http://localhost:1337/fitbit-api-javascript').then(result => {
        // use the access token to fetch the user's profile information
        client.get("/profile.json", result.access_token).then(results => {
            res.send(results[0]);
        }).catch(err => {
            res.status(err.status).send(err);
        });
    }).catch(err => {
        res.status(err.status).send(err);
    });
});

module.exports = router;