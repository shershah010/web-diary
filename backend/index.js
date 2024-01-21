const fs = require('fs')
const cors = require('cors');
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

/** Declare  configs in order to connect to MongoDB. */
config = JSON.parse(fs.readFileSync("./config.json"));
const MongoClient = require("mongodb").MongoClient;
const CONNECTION_URL = "mongodb+srv://" + config["mongodb"]["username"] + ":" + config["mongodb"]["password"] + "@" + config["mongodb"]["url"] +"/test?retryWrites=true&w=majority";
const DATABASE_NAME = "diary_entries_db";
let database, collection;

/** Configurations for the server, in particular read all requests as JSON. */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/** Requests to the root should display a hello world message. Useful for 
 * networking and routing testing. */
app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(Buffer.from('<h1>Hi from the Express Backend for Web Diary</h1>'))
});

/** Returns all the diary entries. */
app.get('/entry', (req, res) => {
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

/** Fetches a single diary entry by title. Returns an file not found error if 
 * the title cannot be found. */
app.get('/entry/:title', (req, res) => {
  collection.findOne({title: req.params.title}, (error, result) => {
    if (error) {
      res.status(404).send({
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

/** Creates a new diary entry. If an entry with the same title exists, then this
 *  throws an error to the frontend. Otherwise, generate the mood for the entry 
 * and save it in the database. */
app.post('/create', (req, res) => {
  let entry = req.body['entry'];
  collection.findOne({title: entry.title}, (error, result) => {
    if (error) {
      // Title already in use.
      res.status(500).send({
        success: 'false',
        message: 'unsuccessful read a file',
        exists: null
      });
    } else if (result == null) {
      // Get mood of post.
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
          // Mood request failed.
          console.log(error);

          res.status(500).send({
            success: 'false',
            message: 'failed to write',
            exists: false
          });
        } else {
          // Add mood to entry and upload to database.
          const mood = JSON.parse(response.body);

          collection.insertOne({
            title: entry.title,
            date: entry.date,
            startTime: entry.startTime,
            endTime: entry.endTime,
            content: entry.content,
            goodMood: mood["mood"]
          });

          res.status(200).send({
            success: 'true',
            message: 'successful write',
            exists: false
          });
        }
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

/** Updates a particular entry. No need to check if the entry exists because it 
 * must exists if this endpoint is called on it. */
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

/** Connect to the MongoDB database holding the diary entries. */
MongoClient.connect(CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true }, (error, client) => {
    if (error) {
        throw error;
    }
    database = client.db(DATABASE_NAME);
    collection = database.collection(config["mongodb"]["collection"]);
    console.log("Connected to `" + DATABASE_NAME + "`!");
});


/** Launch the backend! */
const port = 80;
app.listen(port, () => {
  console.log(`Web Diary Backend listening on port ${port}!`);
});

