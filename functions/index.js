const admin = require('firebase-admin');
const express = require('express');
const functions = require('firebase-functions');

const app = express();

admin.initializeApp(functions.config().firebase);
var db = admin.firestore();
db.settings({timestampsInSnapshots: true});

app.all('/preprocess', (req, res) => {
  console.log(req.body);
  console.log(JSON.stringify(req.body, null, 4));
  if (!req.body) {
    throw 'No body content';
  }

  var colRef = db.collection('line');
  const {events} = req.body;
  var batch = db.batch();
  var addNewMsgs = events.map((elem) => {
    return colRef.doc(elem.source.userId).collection('lineMessages').add(elem);
  });
  return Promise.all(addNewMsgs).then(() => {
    res.send('hello world');
  }).catch(err => {
    console.log(err);
    res.send('error');
  });
});


exports.webhook = functions.https.onRequest(app);
