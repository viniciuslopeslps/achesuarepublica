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

    def create_location(self, city_locat, state_locat, adress_locat, id_usu):
        try:
            cursor = self.base.get_cursor()
            conn = self.base.get_conn()
            key_locat = city_locat.lower() + ' - ' + state_locat.lower()
            cursor.execute("insert into location values (0,'{0}','{1}','{2}','{3}','{4}' ); "
            .format(city_locat, state_locat, adress_locat, key_locat, id_usu))
            conn.commit()
            return 'SUCCESS'
        except Exception:
            return 'ERROR'

    def get_locations_by_id(self, id_usu):
        cursor = self.base.get_cursor()
        cursor.execute("select * from location where id_usu = '{0}' ; ".format(id_usu))
        locations = cursor.fetchall()

        if(len(locations)==0):
            return jsonify(locations = None)

        array = []
        for x in locations:
            dic = {'id_locat':x[0],'city_locat':x[1],'state_locat':x[2],
            'address_locat':x[3],'key_locat':x[4],'id_usu': x[5]}
            array.append(dic)
        return jsonify(locations = array)

    def update_location(self, city_locat, state_locat, address_locat, id_locat, id_usu):
        try:
            cursor = self.base.get_cursor()
            conn = self.base.get_conn()

            key_locat = city_locat.lower() + ' - ' + state_locat.lower()
            query = "update location set city_locat = '{0}', state_locat = '{1}', address_locat = '{2}', key_locat = '{3}' where id_locat = {4} and id_usu = {5} ; ".format(city_locat, state_locat,
            address_locat, key_locat, id_locat, id_usu)
            cursor.execute(query)
            conn.commit()
            return 'SUCCESS'
        except Exception:
            return 'ERROR'

    def delete_location(self, id_locat):
        try:
            cursor = self.base.get_cursor()
            conn = self.base.get_conn()
            cursor.execute("delete from location where id_locat = '{0}'".format(id_locat))
            conn.commit()
            return 'SUCCESS'
        except Exception:
            return 'ERROR'

        cursor = self.base.get_cursor()

    def get_location_keys(self):
        cursor = self.base.get_cursor()
        cursor.execute("select key_locat from location;")
        locations = cursor.fetchall()

        if(len(locations)==0):
            return jsonify(locations = None)
        array = []
        for x in locations:
            array.append(x[0])
        return jsonify(locations = array)
