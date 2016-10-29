# -*- coding: UTF-8 -*-
import os, time, json, uuid, smtplib, hashlib
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
from email.mime.text import MIMEText
from datetime import timedelta, datetime
from flask import Flask, request, redirect, render_template, jsonify

class User():
    def __init__(self, base):
       self.base = base
       self.cursor = self.base.get_cursor()
       self.conn = self.base.get_conn()

    def login(self, email, password):
        query = "select * from users where email_usu = '{0}' and password_usu='{1}'".format(email, password)
        self.cursor.execute(query)

        user = self.cursor.fetchall()
        if(len(user)==0):
            return jsonify(user = None)

        dic = {'id':user[0][0],'name':user[0][1],'email':user[0][2],'password':user[0][3],
        'phone':user[0][4],'admin': user[0][5]}

        return jsonify(user = dic)

    def new_user(self, email, password, name, phone):
        query = "insert into users values (0,'{0}','{1}','{2}','{3}', 0);".format(name, email, password, phone)
        self.cursor.execute(query)
        self.conn.commit()
        return 'SUCCESS'

    def update_user(self, name, email, phone, id_usu):
        try:
            self.cursor.execute("update users set email_usu='{0}', name_usu='{1}', phone_user='{2}' where id_usu='{3}';"
            .format(email, name, phone, id_usu))
            self.conn.commit()
            return 'SUCCESS'
        except Exception:
            return 'ERROR'

    def delete_user(self, id_usu):
        self.cursor.execute("delete from users where id_usu = '{0}'".format(id_usu))
        self.conn.commit()
        return 'SUCCESS'

    def update_password_user(self, password, id_usu):
        try:
            self.cursor.execute("update users set password_usu='{0}' where id_usu='{1}';".format(password, id_usu))
            self.conn.commit()
            return 'SUCCESS'
        except Exception:
            return 'ERROR'

    def reset_password(self, email_usu):
        self.cursor.execute("select * from users where email_usu = '{0}' ; ".format(email_usu))
        user = self.cursor.fetchall()
        if(len(user)==0):
            return jsonify(answer = None)

        token = uuid.uuid4().hex
        tokenHash = hashlib.sha512(token).hexdigest()

        id_usu = user[0][0]

        self.cursor.execute("update users set password_usu='{0}' where id_usu='{1}';".format(tokenHash, id_usu))
        self.conn.commit()
        assunto = 'Recuperação de senha - Ache sua república'
        mensagem = 'Olá senhor(a), foi solicitado uma redefinição de senha no ache sua república, sua nova senha é: ' + token
        self.base.send_email(email_usu, assunto, mensagem)
        dic = {"answer": "SUCCESS"}
        return jsonify(answer = dic)
