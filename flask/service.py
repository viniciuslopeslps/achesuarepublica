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

@app.route('/')
@app.route('/createUser/<email>/<password>/<name>/<phone>', methods =["GET","POST"])
def new_user(email ,password, name, phone):
    print('to aqui')
    if request.method == "POST":
        print(email, password, name, phone)
        cursor.execute("insert into users values (0,'{0}','{1}','{2}','{3}', 0);"
        .format(name, email, password, phone))
        conn.commit()
        return 'Usuário cadastrado com sucesso, Bem vindo ao ache sua república'
    return 'ERRO'

#mudar o ip para testar
if __name__ == "__main__":
    app.run(host="192.168.1.106",debug=True, use_reloader=True)
