# -*- coding: UTF-8 -*-
import os, time, json, uuid, smtplib
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
from email.mime.text import MIMEText
from datetime import timedelta, datetime
from flask import Flask, request, redirect, render_template, jsonify

class Republic():
    def __init__(self, base, location):
       self.base = base
       self.location = location
       self.cursor = self.base.get_cursor()
       self.conn = self.base.get_conn()

    def new_republic(self, name, key_locat, id_usu):
        location = self.location.get_id_and_city_by_key(key_locat)

        key_rep = name.lower() + ' - ' + location[0][1].lower()
        id_locat = location[0][0]

        self.cursor.execute("insert into republic values (0,'{0}','{1}','{2}','{3}');"
        .format(name, id_locat, id_usu, key_rep))
        self.conn.commit()
        return 'SUCCESS'

    def get_republics_by_id(self, id_usu):
        self.cursor.execute("select * from republic r inner join location l on l.id_locat = r.id_locat where r.id_usu = '{0}' ; ".format(id_usu))
        republics = self.cursor.fetchall()

        if(len(republics)==0):
            return jsonify(republics = None)

        array = []
        for x in republics:
            dic = {'id_rep':x[0],'name_rep':x[1], 'id_locat':x[2],'id_usu':x[3], 'key_rep':x[4],
            'city_locat':x[5], 'state_locat':x[7], 'address_locat':x[8],'key_locat':x[9]}
            array.append(dic)
        return jsonify(republics = array)


    def update_republic(self, name_rep, key_locat, id_rep, id_usu):
        location = self.location.get_id_and_city_by_key(key_locat)
        
        key_rep = name_rep.lower() + ' - ' + location[0][1].lower()
        id_locat = location[0][0]

        query = "update republic set name_rep='{0}', id_locat='{1}', key_rep='{2}' where id_usu='{3}' and id_rep='{4}'".format(name_rep, id_locat, key_rep, id_usu, id_rep)
        self.cursor.execute(query)
        self.conn.commit()
        return 'SUCCESS'

    def delete_republic(self, id_rep, id_usu):
        self.cursor.execute("delete from republic where id_rep = '{0}' and id_usu = '{1}' "
        .format(id_rep, id_usu))
        self.conn.commit()
        return 'SUCCESS'

    def get_republic_keys(self):
        self.cursor.execute("select key_rep from republic;")
        republics = self.cursor.fetchall()

        if(len(republics)==0):
            return jsonify(republics = None)
        array = []
        for x in republics:
            array.append(x[0])
        return jsonify(republics = array)

    def get_id_by_key(self, key_rep):
        self.cursor.execute("select id_rep from republic where key_rep = '{0}' ; ".format(key_rep))
        republic = self.cursor.fetchall()
        return republic[0][0]
