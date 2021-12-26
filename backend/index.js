const fs = require('fs')
const cors = require('cors');
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

config = JSON.parse(fs.readFileSync("./config.json"));

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = "mongodb+srv://" + config["mongodb"]["username"] + ":" + config["mongodb"]["password"] + "@dentries-nsb6p.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "diary_entries_db";

const port = 80;

let database, collection;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(Buffer.from('<h1>Hi from the Express Backend for Web Diary</h1>'))
});

app.get('/update', (req, res) => {
  collection.find({}).toArray((error, result) => {
    if (error) {
      res.status(500).send({
        success: 'false',
        message: 'unsuccessful read all files',
        data: null
      });
    }
    res.status(200).send({
      success: 'true',
      message: 'successful read all files',
      data: result
    });
  });
});

app.post('/get', (req, res) => {
  let filename = req.body['file'];
  collection.findOne({title: filename}, (error, result) => {
    if (error) {
      res.status(500).send({
        success: 'false',
        message: 'bad filename',
        data: null,
      });
    }
    res.status(200).send({
      success: 'true',
      message: 'successful read a file',
      data: result,
    });
  });
});

app.post('/create', (req, res) => {
  let entry = req.body['entry'];
  collection.findOne({title: entry.title}, (error, result) => {
    if (error) {
      res.status(500).send({
        success: 'false',
        message: 'unsuccessful read a file',
        exists: null
      });
    } else if (result == null) {

      const options = {
        uri: 'http://web-diary-ml/get_mood',
        body: JSON.stringify(entry),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }

      request(options, function (error, response) {

        if (error) {
          console.log(error)

          res.status(500).send({
            success: 'false',
            message: 'failed to write',
            exists: false
          });

          return;
        }

        console.log(response.body.toString());
        let goodMood = response.body.toString().substr(0, 1);
        goodMood = goodMood === '1';

        collection.insertOne({
          title: entry.title,
          date: entry.date,
          startTime: entry.startTime,
          endTime: entry.endTime,
          content: entry.content,
          goodMood: goodMood
        });

        res.status(200).send({
          success: 'true',
          message: 'successful write',
          exists: false
        });

      });

    } else {
      res.status(200).send({
        success: 'true',
        message: 'successful read a file',
        exists: true
      });
    }
  });
});

app.post('/update', (req, res) => {
  entry = req.body;
  collection.updateOne({title: entry.title},
                      {$set: {date: entry.date,
                              startTime: entry.startTime,
                              endTime: entry.endTime,
                              content: entry.content,
                              goodMood: entry.goodMood}},
                            (error, result) => {
                              if (error) {
                                return res.status(500).send({
                                  success: 'false',
                                  message: 'bad filename'
                                });
                              }
                              return res.status(200).send({
                                success: 'true',
                                message: 'successful write'
                              });
                            });
});


MongoClient.connect(CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true }, (error, client) => {
    if (error) {
        throw error;
    }
    database = client.db(DATABASE_NAME);
    collection = database.collection(config["mongodb"]["collection"]);
    console.log("Connected to `" + DATABASE_NAME + "`!");
});

app.listen(port, () => {
  console.log(`Web Diary Backend listening on port ${port}!`);
});

