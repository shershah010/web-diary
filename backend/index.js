const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const port = 4004;

const CONNECTION_URL = "mongodb+srv://<username>:<password>@dentries-nsb6p.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "diary_entries_db";

let database, collection;

app.use(cors());

const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
      collection.insertOne({title: entry.title, date: entry.date, startTime: entry.startTime, endTime: entry.endTime,  content: entry.content});
      res.status(200).send({
        success: 'true',
        message: 'successful read a file',
        exists: false
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
                              content: entry.content}},
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

app.listen(port, () => {
  MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("diary_entries");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
  console.log(`Example app listening on port ${port}!`);
});
