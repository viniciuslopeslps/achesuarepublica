# -*- coding: UTF-8 -*-
import os, time, json, uuid, smtplib
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
from email.mime.text import MIMEText
from datetime import timedelta, datetime
from flask import Flask, request, redirect, render_template, jsonify

class Location():
    def __init__(self, base):
       self.base = base
       self.cursor = self.base.get_cursor()
       self.conn = self.base.get_conn()

    def create_location(self, city_locat, state_locat, extra_locat, id_usu):
        try:
            key_locat = city_locat.lower() + ' - ' + state_locat.lower()
            if extra_locat == None:
                query = '''insert into location(city_locat, state_locat, key_locat, id_usu)
                 values ('{0}','{1}','{2}','{3}');'''.format(city_locat, state_locat, key_locat, id_usu)
            else:
                extra_locat = "'" + extra_locat + "'"
                query = "insert into location values (0,'{0}','{1}',{2},'{3}','{4}' );".format(city_locat, state_locat, extra_locat, key_locat, id_usu)
            self.cursor.execute(query)
            self.conn.commit()
            return 'SUCCESS'
        except Exception:
            return 'ERROR'

    def get_locations_by_id_user(self, id_usu):
        query = ''' select * from location where id_usu='{0}'; '''.format(id_usu)
        self.cursor.execute(query)
        locations = self.cursor.fetchall()

        if(len(locations)==0):
            return jsonify(locations = None)

        array = []
        for x in locations:
            dic = {'id_locat':x[0],'city_locat':x[1],'state_locat':x[2],'extra_locat':x[3],
            'key_locat':x[4],'id_usu': x[5]}
            array.append(dic)
        return jsonify(locations = array)

    def update_location(self, city_locat, state_locat, extra_locat, id_locat, id_usu):
        key_locat = city_locat.lower() + ' - ' + state_locat.lower()
        if extra_locat == None:
            extra_locat = 'NULL'
        else:
            extra_locat = "'" + extra_locat + "'"
        query = "update location set city_locat = '{0}', state_locat = '{1}', extra_locat = {2}, key_locat = '{3}' where id_locat = {4} and id_usu = {5} ; ".format(city_locat, state_locat,
        extra_locat, key_locat, id_locat, id_usu)
        self.cursor.execute(query)
        self.conn.commit()
        return 'SUCCESS'

    def delete_location(self, id_locat):
        self.cursor.execute("delete from location where id_locat = '{0}'".format(id_locat))
        self.conn.commit()
        return 'SUCCESS'

    def get_location_keys(self):
        self.cursor.execute("select key_locat from location;")
        locations = self.cursor.fetchall()

        if(len(locations)==0):
            return jsonify(locations = None)
        array = []
        for x in locations:
            array.append(x[0])
        return jsonify(locations = array)

    def get_id_and_city_by_key(self, key_locat):
        self.cursor.execute("select id_locat, city_locat from location where key_locat = '{0}' ; ".format(key_locat))
        location = self.cursor.fetchall()
        return location

    def get_id_by_key(self, key_locat):
        self.cursor.execute("select id_locat from location where key_locat = '{0}' ; ".format(key_locat))
        location = self.cursor.fetchall()
        return location[0][0]
