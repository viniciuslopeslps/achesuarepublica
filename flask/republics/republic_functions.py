# -*- coding: UTF-8 -*-
import os, time, json, uuid, smtplib
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
from email.mime.text import MIMEText
from datetime import timedelta, datetime
from flask import Flask, request, redirect, render_template, jsonify

class Republic():
    def __init__(self, base):
       self.base = base

    def new_republic(self,name, key_locat, id_usu):
        cursor = self.base.get_cursor()
        conn = self.base.get_conn()
        cursor.execute("select id_locat from location where key_locat = '{0}' ; ".format(key_locat))
        location = cursor.fetchall()
        id_locat = location[0][0]

        cursor.execute("insert into republic values (0,'{0}','{1}','{2}');"
        .format(name, id_locat, id_usu))
        conn.commit()
        return 'SUCCESS'
