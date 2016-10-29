# -*- coding: UTF-8 -*-
import os, time, json, uuid, smtplib
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
from email.mime.text import MIMEText
from datetime import timedelta, datetime
from flask import Flask, request, redirect, render_template, jsonify, abort

class Base():

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

    def get_conn(self):
        return self.conn

    def get_cursor(self):
        return self.cursor

    def get_app(self):
        return self.app

    def send_email(self, email, assunto, mensagem):
        #cria um cliente smtp que conectará em smtp.gmail.com na porta 587
        gm = smtplib.SMTP("smtp.gmail.com", 587)
        #nos identificamos no servidor
        gm.ehlo()
        #indicamos que usaremos uma conexão segura
        gm.starttls()
        #reidentificamos no servidor (necessário apos starttls )
        gm.ehlo()
        #faz o login
        gm.login("achesuarepublica@gmail.com", "lopes12345678")
        #Cria um email contendo texto e guarda em mail
        mail = MIMEText(mensagem)
        #Seta destinatário e assunto
        mail["To"] = email
        mail["Subject"] = assunto
        #Envia o email.
        gm.sendmail("achesuarepublica@gmail.com", email, mail.as_string())
        #fecha a conexão
        gm.close()
        return 'email enviado com sucesso!'
    
    def check_request_params(self, allowed_keys, received_keys):    
        if not set(allowed_keys) <= set(received_keys.keys()):
            abort(400)
        return received_keys
