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

@app.route('/')
@app.route('/createUser/<email>/<password>', methods =["GET","POST"])
def new_user(email ,password):
    print('to aqui')
    if request.method == "POST":
        print(email, password)
        #cursor.execute("insert into user values (0,'{0}','{1}','{2}');".format(dados['name'],dados['email'],dados['password']))
        #conn.commit()
        return 'DEU CERTO'
    return 'ERRO'

if __name__ == "__main__":
    app.run(debug=True, use_reloader=True)
