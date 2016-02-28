# coding: utf-8
import os, time, json

from flask.ext.cors import CORS
from flaskext.mysql import MySQL
import smtplib
from email.mime.text import MIMEText
from datetime import timedelta, datetime
from flask import Flask, request, redirect, render_template, jsonify

app = Flask(__name__)
cors = CORS(app)

mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'root'
app.config['MYSQL_DATABASE_DB'] = 'acheSuaRepublica'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)


conn = mysql.connect()
cursor = conn.cursor()

@app.route('/createUser/<email>/<password>/<name>/<phone>', methods =["POST"])
def new_user(email ,password, name, phone):
    if request.method == "POST":
        print(email, password, name, phone)
        cursor.execute("insert into users values (0,'{0}','{1}','{2}','{3}', 0);"
        .format(name, email, password, phone))
        conn.commit()
        return 'SUCCESS'
    return 'ERROR'

@app.route('/login/<email>/<password>')
def login(email, password):
    cursor.execute("select * from users where email_usu = '{0}' and password_usu='{1}'".format(email, password))
    user = cursor.fetchall()

    if(len(user)==0):
        return jsonify(user = None)

    dic = {'id':user[0][0],'name':user[0][1],'email':user[0][2],'password':user[0][3],
    'phone':user[0][4],'admin': user[0][5]}

    return jsonify(user = dic)

#mudar o ip para testar
if __name__ == "__main__":
    app.run(host="192.168.0.12",debug=True, use_reloader=True)
