import os
import json
import urllib
import pymongo
import pandas as pd
import numpy as np
import tensorflow as tf
import tensorflow_datasets as tfds

# Get config
config = json.load(open("./config.json"))

# Get the data
if not os.path.exists('entries.csv'):
    uri = "mongodb+srv://" + urllib.parse.quote(config["mongodb"]["username"]) + ":" + urllib.parse.quote(config["mongodb"]["password"]) + "@dentries-nsb6p.mongodb.net/test?retryWrites=true&w=majority"
    client = pymongo.MongoClient(uri)
    db = client.diary_entries_db
    db.list_collection_names()
    collection = db[config["mongodb"]["collection"]]
    df = pd.DataFrame(list(collection.find()))
    df.to_csv('entries.csv') 
else:
    df = pd.read_csv('entries.csv')


# Clean the data
df = df.drop(columns=['_id', 'date', 'startTime', 'endTime'])
df['content'] = df['content'].str.lower().str.replace(r'[.?,!"\']', '')
df['content'] = df['content'].str.lower().str.replace('/', ' ')
df['goodMood'] = df['goodMood'].replace({True: 1, False: 0})

# Train model
def get_unique_words(paragraphs):
    all_words = set()
    for p in paragraphs:
        words = p.split(' ')
        [all_words.add(w) for w in words]
    return all_words

encoder = tfds.features.text.SubwordTextEncoder(get_unique_words(df['content']))
encoder.vocab_size

dataset = pd.DataFrame([encoder.encode(para) for para in df['content']], dtype=int).fillna(0).values
dataset = tf.data.Dataset.from_tensor_slices((dataset, df['goodMood']))

BUFFER_SIZE = 10000
BATCH_SIZE = 64

train_dataset = dataset.skip(int(0.3 * df.shape[0])).shuffle(BUFFER_SIZE).repeat()
train_dataset = train_dataset.batch(BATCH_SIZE)

test_dataset = dataset.take(int(0.3 * df.shape[0])).batch(BATCH_SIZE)

model = tf.keras.Sequential([
    tf.keras.layers.Embedding(encoder.vocab_size + 1, 64),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1)
])

model.compile(loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
              optimizer=tf.keras.optimizers.Adam(1e-4),
              metrics=['accuracy'])

history = model.fit(train_dataset, epochs=5,
                    steps_per_epoch=100,
                    validation_data=test_dataset,
                    validation_steps=25)

# Save data
encoder.save_to_file('encoder')
model.save('word2vec.keras')
