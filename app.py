from flask import Flask, render_template, request

app = Flask(__name__)


authorization = None


# Set up the homepage
@app.route('/')
def homepage():
    print("homepage")
    return render_template("index.html")


# Set up create playlist page
@app.route('/createplaylist')
def createplaylist():
    print("createplaylist")
    # global user_id
    # user_id = request.args.get("user_id")
    global authorization
    authorization = request.args.get("access_token")
    return render_template("createplaylist.html", authorization=authorization)


# Set up result page
@app.route('/result')
def result():
    return render_template("result.html")


if __name__ == '__main__':
    app.run(port=5000, debug=True)
