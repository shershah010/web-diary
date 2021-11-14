import subprocess
from flask import Flask, request

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<h1>Hi from the machine learning server for Web Diary</h1>"


@app.route('/get_mood', methods=['POST'])
def get_mood():
    return subprocess.check_output(['python3', 'entry2mood.py', request.json.get('content', '')])

if __name__ == '__main__':
    # context = ('tls/web-diary-ml.sher.com.crt', 'tls/web-diary-ml.sher.com.key')
    app.run(host='0.0.0.0', port=80, debug=True)

