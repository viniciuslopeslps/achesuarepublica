# -*- coding: UTF-8 -*-
import os, time, json, uuid, smtplib
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
from email.mime.text import MIMEText
from datetime import timedelta, datetime
from flask import Flask, request, redirect, render_template, jsonify

class University():
    def __init__(self, base):
       self.base = base

    def new_university(self, name, key_locat):
        cursor = self.base.get_cursor()
        conn = self.base.get_conn()
        cursor.execute("select id_locat, state_locat from location where key_locat = '{0}' ; ".format(key_locat))
        location = cursor.fetchall()
        key_uni = name.lower() + ' - ' + location[0][1].lower()

        cursor.execute("insert into university values (0,'{0}','{1}','{2}');"
        .format(key_uni, name, location[0][0]))
        conn.commit()
        return 'SUCCESS'
