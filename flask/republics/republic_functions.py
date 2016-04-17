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

    def get_republics_by_id(self, id_usu):
        cursor = self.base.get_cursor()
        cursor.execute("select * from republic r inner join location l on l.id_locat = r.id_locat where r.id_usu = '{0}' ; ".format(id_usu))
        republics = cursor.fetchall()

        if(len(republics)==0):
            return jsonify(republics = None)

        array = []
        for x in republics:
            dic = {'id_rep':x[0],'name_rep':x[1], 'id_locat':x[2],'id_usu':x[3],'city_locat':x[5],
                'state_locat':x[6], 'address_locat':x[7],'key_locat':x[8]}
            array.append(dic)
        return jsonify(republics = array)


    def update_republic(self,name_rep,key_locat_rep, id_rep, id_usu):
        cursor = self.base.get_cursor()
        conn = self.base.get_conn()
        cursor.execute("select id_locat from location where key_locat = '{0}' ; ".format(key_locat_rep))
        location = cursor.fetchall()
        id_locat = location[0][0]

        query = "update republic set name_rep='{0}', id_locat='{1}' where id_usu='{2}' and id_rep='{3}'".format(name_rep, id_locat, id_usu, id_rep)
        cursor.execute(query)
        conn.commit()
        return 'SUCCESS'

    def delete_republic(self, id_rep, id_usu):
        cursor = self.base.get_cursor()
        conn = self.base.get_conn()
        cursor.execute("delete from republic where id_rep = '{0}' and id_usu = '{1}' "
        .format(id_rep, id_usu))
        conn.commit()
        return 'SUCCESS'
