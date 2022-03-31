from flask import Flask, render_template, request, redirect, url_for, session, jsonify, abort
from flask_mysqldb import MySQL, MySQLdb
import bcrypt
import gspread
from oauth2client.service_account import ServiceAccountCredentials

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'radio-database'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.secret_key = "^A%DJAJU^JJ123"

mysql = MySQL(app)

scope = ['https://spreadsheets.google.com/feeds',
             'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('/var/www/html/radionelayan/[your json file]', scope)
client = gspread.authorize(creds)
gsheet = client.open("DataNodeMCU").sheet1

@app.route('/all_reviews', methods=["GET"])
def all_reviews():
    dataLen = len(gsheet.get_all_records())+1
    latitude = gsheet.cell(dataLen,3).value
    longitude = gsheet.cell(dataLen,4).value
    cur = mysql.connection.cursor()
    cur.execute("UPDATE user SET Latitude = %s, Longitude = %s WHERE Name = %s",(latitude,longitude, 'Tommy Supardi'))
    mysql.connection.commit()
    return jsonify(latitude,longitude)

@app.route("/")
def landing():
    return render_template('landing.html')

@app.route("/main", methods=["GET"])
def main():
    cur = mysql.connection.cursor()
    warning_user = cur.execute("SELECT * FROM user") 
    if (warning_user > 0):
        fetchdata = cur.fetchall()
    return render_template('index.html', wu=fetchdata[0])

@app.route("/deviceactive", methods=["GET"])
def deviceActive():
    cur = mysql.connection.cursor()
    latitude = cur.execute("SELECT Latitude FROM user")  
    if latitude > 0:
        fetchdata = cur.fetchall()
        latitudeTot = sum([(x['Latitude']!=0) for x in fetchdata])
    return (str(latitudeTot))

@app.route("/sensor", methods=["GET"])
def sensor():
    cur = mysql.connection.cursor()
    warning = cur.execute("SELECT * FROM user") 
    if warning > 0:
        fetchdata = cur.fetchall()
    return fetchdata[0]

@app.route("/location", methods=["GET"])
def totUser():
    cur = mysql.connection.cursor()
    loc = cur.execute("SELECT * FROM user")
    if loc > 0:
        fetchuser = cur.fetchall()
    return fetchuser[0]

@app.route("/user")
def user():
    cur = mysql.connection.cursor()
    user = cur.execute("SELECT * FROM user")
    if user > 0:
        fetchdata = cur.fetchall()
        total = len(fetchdata)
    return render_template('index-user-interface.html', data=fetchdata, totalofuser=total)

@app.route("/signin", methods=["GET","POST"])
def signin():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password'].encode('utf-8')
        curl = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curl.execute("SELECT * FROM datauser WHERE email=%s",(email,))
        user = curl.fetchone()
        curl.close()

        if len(user) > 0:
            if bcrypt.hashpw(password, user["password"].encode('utf-8')) == user["password"].encode('utf-8'):
                session['email'] = user['email']
                session['name'] = user['name']
                return redirect(url_for('main'))
            else:
                return "Error password and email not match"
        else:
            return "Error user not found"
    else:
        return render_template('signin.html')

@app.route("/signup", methods=["GET","POST"])
def signup():
    if request.method == "GET" :
        return render_template('signup.html')
    else:
        name = request.form['name']
        email = request.form['email']
        password = request.form['password'].encode('utf-8')
        hash_password = bcrypt.hashpw(password, bcrypt.gensalt())

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO datauser (name, email, password) VALUES (%s,%s,%s)",(name,email,hash_password))
        mysql.connection.commit()
        session['name'] = request.form['name']
        session['email'] = request.form['email']
    return redirect(url_for('signin'))

#if __name__ == "__main__":
#    app.secret_key = "^A%DJAJU^JJ123"
#    app.run(host='0.0.0.0', port=5000,debug=True)
