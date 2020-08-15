FROM nikolaik/python-nodejs

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

RUN python -m  pip install --upgrade pip
RUN pip install -r ml-models/requirements.txt
RUN python -m nltk.downloader stopwords

EXPOSE 4004
CMD ["npm", "start"]
