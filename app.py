from flask import Flask, render_template, request
import json

app = Flask(__name__)


authorization = None
user_id = None


# Set up the homepage
@app.route('/')
def homepage():
    print("homepage")
    return render_template("index.html")


@app.route('/set_fields')
def set_fields():
    print("setFields")
    global authorization
    authorization = request.args["access_token"]
    global user_id
    user_id = request.args["id"]
    return authorization


# Set up create playlist page
@app.route('/create_playlist')
def create_playlist():
    print("createplaylist")
    global authorization
    return render_template("createplaylist.html", user_id=user_id, authorization=authorization)


# Set up result page
@app.route('/result')
def result():
    return render_template("result.html")


if __name__ == '__main__':
    app.run(port=5000, debug=True)
