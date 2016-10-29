# -*- coding: UTF-8 -*-
import os, time, json, uuid, smtplib
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
from email.mime.text import MIMEText
from datetime import timedelta, datetime
from flask import Flask, request, redirect, render_template, jsonify

class University():
    def __init__(self, base, location):
       self.base = base
       self.location = location
       self.cursor = self.base.get_cursor()
       self.conn = self.base.get_conn()

    def new_university(self, name, key_locat, id_usu):
        location = self.location.get_id_and_city_by_key(key_locat)

        key_uni = name.lower() + ' - ' + location[0][1].lower()
        id_locat = location[0][0]
        self.cursor.execute("insert into university values (0,'{0}','{1}','{2}','{3}');"
        .format(key_uni, name, id_locat, id_usu))
        self.conn.commit()
        return 'SUCCESS'

    def get_universities_by_id(self, id_usu):
        self.cursor.execute("select * from university u inner join location l on l.id_locat = u.id_locat where u.id_usu = '{0}' ; ".format(id_usu))
        universities = self.cursor.fetchall()

        if(len(universities)==0):
            return jsonify(universities = None)

        array = []
        for x in universities:
            dic = {'id_uni':x[0],'key_uni':x[1],'name_uni':x[2],
            'id_locat':x[3],'id_usu':x[4],'city_locat':x[6],
            'state_locat':x[7], 'address_locat':x[8],'key_locat':x[9]}
            array.append(dic)
        return jsonify(universities = array)

    def update_university(self, name, key_locat, id_uni, id_usu):
        location = self.location.get_id_and_city_by_key(key_locat)
        key_uni = name.lower() + ' - ' + location[0][1].lower()
        id_locat = location[0][0]

        query = '''update university set key_uni='{0}',
        name_uni='{1}', id_locat='{2}' where id_usu='{3}' and id_uni='{4}' '''.format(key_uni, name, id_locat, id_usu, id_uni)

        self.cursor.execute(query)
        self.conn.commit()
        return 'SUCCESS'

    def delete_university(self, key_uni, id_usu):
        self.cursor.execute("delete from university where key_uni = '{0}' and id_usu = '{1}' "
        .format(key_uni, id_usu))
        self.conn.commit()
        return 'SUCCESS'

    def get_university_keys(self):
        self.cursor.execute("select key_uni from university;")
        universities = self.cursor.fetchall()

        if(len(universities)==0):
            return jsonify(universities = None)
        array = []
        for x in universities:
            array.append(x[0])
        return jsonify(universities = array)

    def get_id_by_key(self, key_uni):
        self.cursor.execute("select id_uni from university where key_uni = '{0}' ; ".format(key_uni))
        university = self.cursor.fetchall()
        return university[0][0]
