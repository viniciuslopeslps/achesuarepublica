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

    def get_rooms(self):
        cursor = self.base.get_cursor()
        conn = self.base.get_conn()
        cursor.execute("select ro.id_room, ro.title,ro.price,lo.key_locat from room ro inner join location lo on (lo.id_locat = ro.id_locat) group by ro.created_at asc;")

        rooms = cursor.fetchall()

        if(len(rooms)==0):
            return jsonify(rooms = None)

        array = []
        for x in rooms:
            dic = {'id_room':x[0],'title':x[1],'price': str(x[2]), 'key_locat':x[3]}
            array.append(dic)

        return jsonify(rooms = array)

    def get_room_by_id(self, id_room):
        cursor = self.base.get_cursor()

        query = '''select DISTINCT ro.id_room,ro.title,ro.created_at,ro.description,
         l.key_locat, u.key_uni, if(ro.id_rep!=0, re.key_rep,'') as key_rep, ro.price,
		 us.name_usu, us.email_usu
         from room ro,location l, university u, republic re, users us
         where l.id_locat = ro.id_locat and
         ro.id_uni = u.id_uni and us.id_usu = ro.id_usu
         and if(ro.id_rep!=0, ro.id_rep = re.id_rep,1) and ro.id_room='{0}'; '''.format(id_room);

        cursor.execute(query)
        room = cursor.fetchall()

        if(len(room)==0):
            return jsonify(room = None)

        array = []
        for x in room:
            dic = {'id_room':x[0],'title':x[1], 'created_at':x[2],'description':x[3],
             'key_locat':x[4],'key_uni':x[5], 'key_rep':x[6], 'price': str(x[7]),
             'name_owner': x[8], 'email_owner': x[9]}
            array.append(dic)
        return jsonify(room = array)

    def send_email_interested(self, email_owner, email_usu, subject, message):
        assunto = 'Contato ache sua república - usuário interessado enviou: {0}'.format(subject)
        mensagem = 'Olá senhor(a), foi solicitado uma mensagem do senhor dono do email: {0} , enviou a seguinte mensagem: {1}'.format(email_usu, message)
        self.base.send_email(email_usu, assunto, mensagem)
        dic = {"answer": "SUCCESS"}
        return jsonify(answer = dic)

    def get_search_rooms(self, location, republic, university, price):
        cursor = self.base.get_cursor()
        query = '''
            select distinct ro.id_room, ro.title, ro.price, ro.description
            FROM room ro inner join location lo on(ro.id_locat=lo.id_locat)
            inner join republic re on(re.id_rep=ro.id_rep or ro.id_rep=0)
            inner join university uni on (uni.id_uni=ro.id_uni)
            where (ro.price >={3}) and (lo.key_locat like '%{0}%')
            or (uni.key_uni like '%{1}%' )
            or (ro.id_rep !=0 and re.key_rep like '%{2}%')
            order by ro.created_at desc; '''.format(location, university, republic, price)

        cursor.execute(query)
        rooms = cursor.fetchall()

        array = []
        for x in rooms:
            dic = {'id_room':x[0],'title':x[1],'price': str(x[2]), 'description':x[3]}
            array.append(dic)
        return jsonify(rooms = array)
