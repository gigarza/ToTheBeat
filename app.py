from flask import Flask, render_template, request
import json

app = Flask(__name__)


authorization = None
user_id = None
play_name = None
play_num = None
play_tempo = None
play_id = None


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


@app.route('/playlist_info')
def playlist_info():
    print("playlist_info")
    global play_name
    play_name = request.args["name"]
    global play_num
    play_num = request.args["num"]
    global play_tempo
    play_tempo = request.args["tempo"]
    global play_id
    play_id = request.args["id"]
    return play_id

# Set up result page
@app.route('/result')
def result():
    print("result")
    global play_name
    global play_num
    global play_tempo
    global play_id
    global user_id
    return render_template("result.html", user_id=user_id, name=play_name, num_songs=play_num, tempo=play_tempo, id=play_id)


if __name__ == '__main__':
    app.run(port=5000, debug=True)
