import os
import sys

import pymongo
import urllib

import pandas as pd
import numpy as np

import nltk
from nltk.corpus import stopwords
stopwords = list(stopwords.words('english'))

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.linear_model import SGDClassifier

if not os.path.exists('entries.csv'):
    uri = "mongodb+srv://" + urllib.parse.quote("user") + ":" + urllib.parse.quote("Pizza.network1") + "@dentries-nsb6p.mongodb.net/test?retryWrites=true&w=majority"
    client = pymongo.MongoClient(uri)
    db = client.diary_entries_db
    db.list_collection_names()
    collection = db['diary_entries']
    df = pd.DataFrame(list(collection.find()))
    df.to_csv('entries.csv')
else:
    df = pd.read_csv('entries.csv')

df = df.drop(columns=['_id', 'date', 'startTime', 'endTime'])
df['content'] = df['content'].str.lower().str.replace(r'[.?,!]', '')
df['goodMood'] = df['goodMood'].replace({True: 1, False: 0})

text_clf_svm = Pipeline([('vect', CountVectorizer()),
                         ('tfidf', TfidfTransformer()),
                         ('clf-svm', SGDClassifier(loss='hinge',
                                                   penalty='l2',
                                                   alpha=1e-3,
                                                   random_state=42)
                                                   ),])

text_clf_svm.fit(df['content'], df['goodMood'])
prediction = text_clf_svm.predict([sys.argv[0]])

print(prediction[0])
sys.stdout.flush()
