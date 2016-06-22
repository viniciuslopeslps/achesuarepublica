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

    def new_room(self, locat_key, university_key, republic_key, description, title, id_usu, price):
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
            id_rep = 0

        query = "insert into room values (0,'{0}','{1}','{2}','{3}','{4}','{5}','{6}', NOW());".format(description, id_locat, id_rep, id_uni, id_usu, title, price)
        cursor.execute(query)
        conn.commit()
        return 'SUCCESS'

    def get_rooms_by_user(self, id_usu):
        cursor = self.base.get_cursor()

        query = '''select DISTINCT ro.id_room,ro.title,ro.created_at,ro.description,
         l.key_locat, u.key_uni, if(ro.id_rep!=0, re.key_rep,'') as key_rep, ro.price
         from room ro,location l, university u, republic re
         where l.id_locat = ro.id_locat and
         ro.id_uni = u.id_uni
         and if(ro.id_rep!=0, ro.id_rep = re.id_rep,1) and u.id_usu= '{0}'; '''.format(id_usu);


        cursor.execute(query)
        rooms = cursor.fetchall()

        if(len(rooms)==0):
            return jsonify(rooms = None)


        array = []
        for x in rooms:
            dic = {'id_room':x[0],'title':x[1], 'created_at':x[2],'description':x[3],
             'key_locat':x[4],'key_uni':x[5], 'key_rep':x[6], 'price': str(x[7])}
            array.append(dic)
        return jsonify(rooms = array)

    def update_room(self, locat_key, university_key, republic_key, description, title, price, id_usu, id_room):
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
            id_rep = 0

        query = "update room set description='{0}', id_locat='{1}', id_rep='{2}', id_uni='{3}', title='{4}', price='{5}' where id_usu='{6}' and id_room='{7}' ;".format(description, id_locat, id_rep, id_uni, title, price, id_usu, id_room)
        print query
        cursor.execute(query)
        conn.commit()
        return 'SUCCESS'

    def delete_room(self, id_room, id_usu):
        cursor = self.base.get_cursor()
        conn = self.base.get_conn()
        cursor.execute("delete from room where id_room = '{0}' and id_usu = '{1}' ;"
        .format(id_room, id_usu))
        conn.commit()
        return 'SUCCESS'
