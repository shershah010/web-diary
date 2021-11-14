import os
import sys
import re
import pymongo
import urllib

from pymongo import MongoClient

import pandas as pd
import numpy as np
import torch
from transformers import RobertaConfig, RobertaModel
from transformers import RobertaTokenizer

# if not os.path.exists('entries.csv'):
#     uri = "mongodb+srv://user:VgbndHSiFjBkcVHq@dentries-nsb6p.mongodb.net/test?retryWrites=true&w=majority"
#     client = MongoClient(uri)
#     db = client.diary_entries_db
#     db.list_collection_names()
#     collection = db['diary_entries']
#     df = pd.DataFrame(list(collection.find()))
#     df.to_csv('entries.csv')
# else:
#     df = pd.read_csv('entries.csv')


# df = df.drop(columns=['_id', 'date', 'startTime', 'endTime'])
# df['goodMood'] = df['goodMood'].replace({True: 1, False: 0})

# Set current path to path where this file is located and thus where the model is located
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = RobertaModel.from_pretrained('roberta-base').to(device)
tokenizer = RobertaTokenizer.from_pretrained('roberta-base')

model.eval()

class RoBERTaModel(torch.nn.Module):
    def __init__(self, dropout=0):
        super().__init__()  
        self.bert = model    
        self.drop = torch.nn.Dropout(p=dropout)
        self.dense = torch.nn.Linear(768, 2)
        torch.nn.init.xavier_normal_(self.dense.weight)
        
    def forward(self, input_ids, attention_mask):     
        encoded_layers = model(input_ids=input_ids, attention_mask=attention_mask)
        roberta_output = encoded_layers['pooler_output']
        out = self.drop(roberta_output)
        logits = self.dense(out)
        return logits

    def freeze_bert_encoder(self):
        for param in self.bert.parameters():
            param.requires_grad = False

dj_model = RoBERTaModel(0.1)
dj_model.load_state_dict(torch.load('dj_model.pt', map_location=torch.device(device)))
dj_model.to(device)
dj_model.eval()

def get_prediction(text):
    data = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    encoding, attention_mask = data['input_ids'].to(device), data['attention_mask'].to(device)
    predictions = dj_model(encoding, attention_mask)
    return np.argmax(predictions.detach().numpy())

prediction = get_prediction(sys.argv[1])

print(int(prediction))
sys.stdout.flush()