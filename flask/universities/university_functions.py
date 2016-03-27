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

    def new_university(self, name, key_locat, id_usu):
        cursor = self.base.get_cursor()
        conn = self.base.get_conn()
        cursor.execute("select id_locat, state_locat from location where key_locat = '{0}' ; ".format(key_locat))
        location = cursor.fetchall()
        key_uni = name.lower() + ' - ' + location[0][1].lower()
        id_locat = location[0][0]
        cursor.execute("insert into university values (0,'{0}','{1}','{2}','{3}');"
        .format(key_uni, name, id_locat, id_usu))
        conn.commit()
        return 'SUCCESS'

    def get_universities_by_id(self, id_usu):
        cursor = self.base.get_cursor()
        cursor.execute("select * from university u inner join location l on l.id_locat = u.id_locat where u.id_usu = '{0}' ; ".format(id_usu))
        universities = cursor.fetchall()

        if(len(universities)==0):
            return jsonify(universities = None)

        array = []
        for x in universities:
            dic = {'id_uni':x[0],'key_uni':x[1],'name_uni':x[2],
            'id_locat':x[3],'id_usu':x[4],'city_locat':x[6],
            'state_locat':x[7], 'address_locat':x[8],'key_locat':x[9]}
            array.append(dic)
        return jsonify(universities = array)

    def delete_university(self, key_uni):
        try:
            cursor = self.base.get_cursor()
            conn = self.base.get_conn()
            cursor.execute("delete from university where key_uni = '{0}'".format(key_uni))
            conn.commit()
            return 'SUCCESS'
        except Exception:
            return 'ERROR'
