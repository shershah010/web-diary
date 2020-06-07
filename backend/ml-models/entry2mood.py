import os
import sys
import re
import pymongo
import urllib
import pickle

import pandas as pd
import numpy as np
from scipy import stats

from sklearn.feature_extraction.text import TfidfTransformer, TfidfVectorizer, CountVectorizer
from sklearn.linear_model import LogisticRegression

import keras as K
from tensorflow.python.keras.preprocessing.text import Tokenizer
from tensorflow.python.keras.preprocessing.sequence import pad_sequences

svm_filename = 'svm_model.pkl'
tfidf_filename = 'tfidf_model.pkl'
w2v_filename = 'w2v_filename.pkl'

with open(svm_filename, 'rb') as file:
    svm_model = pickle.load(file)

with open(tfidf_filename, 'rb') as file:
    tfidf_logistic_model = pickle.load(file)

with open(w2v_filename, 'rb') as file:
    w2v_model = pickle.load(file)

if not os.path.exists('entries.csv'):
    uri = "mongodb+srv://" + urllib.parse.quote("user") + ":" + urllib.parse.quote("PASSWORD") + "@dentries-nsb6p.mongodb.net/test?retryWrites=true&w=majority"
    client = pymongo.MongoClient(uri)
    db = client.diary_entries_db
    db.list_collection_names()
    collection = db['diary_entries']
    df = pd.DataFrame(list(collection.find()))
    df.to_csv('entries.csv')
else:
    df = pd.read_csv('entries.csv')

def flatten(ll):
    s = []
    for l in ll:
        s.extend(l)
    return s

df = df.drop(columns=['_id', 'date', 'startTime', 'endTime'])
df['content'] = df['content'].str.lower().str.replace(r'[.?,!"\']', '')
df['content'] = df['content'].str.lower().str.replace('/', ' ')
df['goodMood'] = df['goodMood'].replace({True: 1, False: 0})

unique_words = pd.DataFrame(pd.Series(flatten(df['content'].str.split(' '))).value_counts(), columns=['count'])
unique_words['length'] = unique_words.index.str.len()
number_of_words = np.sum(unique_words['count'])

words_of_interest = unique_words.loc[unique_words['length'] > 0].index

vectorizer = TfidfVectorizer()
vectorizer.fit_transform(df['content'])
tfidf_logistic_model = LogisticRegression(solver='lbfgs')
tfidf_logistic_model.fit(vectorizer.transform(df['content']), df['goodMood'])

tokenizer_obj = Tokenizer()
tokenizer_obj.fit_on_texts(df['content'])
max_length = max([len(s.split()) for s in df['content']])

def data_to_array(data):
    return np.array([np.char.count(data, word) for word in words_of_interest]).T

def all_classifier_predictor(data):
    counts = data_to_array(data)
    vectorized = vectorizer.transform(data)
    tokenized = tokenizer_obj.texts_to_sequences(data)
    padded = pad_sequences(tokenized, maxlen=max_length, padding='post')

    svm_predictions = svm_model.predict(counts)
    tfidf_predictions = tfidf_logistic_model.predict(vectorized)
    w2v_predictions = [i[0] for i in np.round(w2v_model.predict(padded))]

    all_predictions = np.array([svm_predictions,
                                tfidf_predictions,
                                w2v_predictions])

    return stats.mode(all_predictions, axis=0)[0]

prediction = all_classifier_predictor([sys.argv[0]])

print(prediction[0][0])
sys.stdout.flush()
