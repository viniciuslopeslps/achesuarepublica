# -*- coding: UTF-8 -*-
import os, time, json, uuid, smtplib
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
from email.mime.text import MIMEText
from datetime import timedelta, datetime
from flask import Flask, request, redirect, render_template, jsonify

class Room():
    def __init__(self, base):
       self.base = base

    def new_room(self, locat_key, university_key, republic_key, description, id_usu):
        cursor = self.base.get_cursor()
        conn = self.base.get_conn()

        cursor.execute("select id_locat from location where key_locat = '{0}' ; ".format(locat_key))
        location = cursor.fetchall()
        id_locat = location[0][0]

        cursor.execute("select id_uni from university where key_uni = '{0}' ; ".format(university_key))
        university = cursor.fetchall()
        id_uni = university[0][0]


        if(republic_key != 'null'):
            cursor.execute("select id_rep from republic where key_rep = '{0}' ; ".format(republic_key))
            republic = cursor.fetchall()
            id_rep = republic[0][0]
        else:
            id_rep = None

        query = "insert into room values (0,'{0}','{1}','{2}','{3}','{4}', NOW());".format(description, id_locat, id_rep, id_uni, id_usu)
        cursor.execute(query)
        conn.commit()
        return 'SUCCESS'
