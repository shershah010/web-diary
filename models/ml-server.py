from flask import Flask, request
from entry2mood import get_prediction

app = Flask(__name__)

"""Requests to the root page should display a hello world message. This is 
useful for routing and networking."""
@app.route("/")
def hello_world():
    return "<h1>Hi from the machine learning server for Web Diary</h1>"


"""Preforms sentiment analysis on the given entry's body and returns the mood. A
 zero indicates a negative mood and a one indicates a positive mood."""
@app.route('/get_mood', methods=['POST'])
def get_mood():
    return { "mood": get_prediction(request.json.get('content', '')) }

if __name__ == '__main__':
    # context = ('tls/web-diary-ml.sher.com.crt', 'tls/web-diary-ml.sher.com.key')
    app.run(host='0.0.0.0', port=80, debug=True)

