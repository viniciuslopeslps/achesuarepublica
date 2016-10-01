# -*- coding: UTF-8 -*-
import os, time, json, uuid, smtplib
from flask.ext.cors import CORS
from flaskext.mysql import MySQL
from email.mime.text import MIMEText
from datetime import timedelta, datetime
from flask import Flask, request, redirect, render_template, jsonify

class Room():
    def __init__(self, base, location, university, republic):
       self.base = base
       self.location = location
       self.university = university
       self.republic = republic
       self.cursor = self.base.get_cursor()
       self.conn = self.base.get_conn()

    def new_room(self, key_locat, key_uni, key_rep, description, title, id_usu, price):
        id_locat = self.location.get_id_by_key(key_locat)
        id_uni = self.university.get_id_by_key(key_uni)

        if(key_rep != 'null'):
            id_rep = self.republic.get_id_by_key(key_rep)
            query = '''insert into room (description, id_locat, id_rep, id_uni, id_usu, title, price, created_at)
            values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}', NOW()); '''.format(description, id_locat, id_rep, id_uni, id_usu, title, price)

        else:
            query = '''insert into room (description, id_locat, id_uni, id_usu, title, price, created_at)
            values ('{0}','{1}','{2}','{3}','{4}','{5}', NOW()); '''.format(description, id_locat, id_uni, id_usu, title, price)

        self.cursor.execute(query)
        self.conn.commit()
        return 'SUCCESS'

    def get_rooms_by_user(self, id_usu):
        query = '''select DISTINCT ro.id_room,ro.title,ro.created_at,ro.description,
         l.key_locat, u.key_uni, if(ro.id_rep!=0, re.key_rep,'') as key_rep, ro.price
         from room ro,location l, university u, republic re
         where l.id_locat = ro.id_locat and
         ro.id_uni = u.id_uni
         and if(ro.id_rep!=0, ro.id_rep = re.id_rep,1) and u.id_usu= '{0}'; '''.format(id_usu);

        self.cursor.execute(query)
        rooms = self.cursor.fetchall()

        if(len(rooms)==0):
            return jsonify(rooms = None)

        array = []
        for x in rooms:
            dic = {'id_room':x[0],'title':x[1], 'created_at':x[2],'description':x[3],
             'key_locat':x[4],'key_uni':x[5], 'key_rep':x[6], 'price': str(x[7])}
            array.append(dic)
        return jsonify(rooms = array)

    def update_room(self, key_locat, key_uni, key_rep, description, title, price, id_usu, id_room):
        id_locat = self.location.get_id_by_key(key_locat)
        id_uni = self.university.get_id_by_key(key_uni)

        if(key_rep != 'null'):
            id_rep = self.republic.get_id_by_key(key_rep)
            query = '''update room set description='{0}', id_locat='{1}', id_rep='{2}', id_uni='{3}', title='{4}', price='{5}'
             where id_usu='{6}' and id_room='{7}' ;'''.format(description, id_locat, id_rep, id_uni, title, price, id_usu, id_room)

        else:
            query = '''update room set description='{0}', id_locat='{1}', id_uni='{2}', title='{3}', price='{4}'
                 where id_usu='{5}' and id_room='{6}' ;'''.format(description, id_locat, id_uni, title, price, id_usu, id_room)

        self.cursor.execute(query)
        self.conn.commit()
        return 'SUCCESS'

    def delete_room(self, id_room, id_usu):
        self.cursor.execute("delete from room where id_room = '{0}' and id_usu = '{1}' ;"
        .format(id_room, id_usu))
        self.conn.commit()
        return 'SUCCESS'

    def get_rooms(self):
        query = '''select ro.id_room, ro.title,ro.price,lo.key_locat
         from room ro inner join location lo on (lo.id_locat = ro.id_locat)
          group by ro.id_room, ro.created_at asc; '''

        self.cursor.execute(query)
        rooms = self.cursor.fetchall()

        if(len(rooms)==0):
            return jsonify(rooms = None)

        array = []
        for x in rooms:
            dic = {'id_room':x[0],'title':x[1],'price': str(x[2]), 'key_locat':x[3]}
            array.append(dic)

        return jsonify(rooms = array)

    def get_room_by_id(self, id_room):

        query = '''select DISTINCT ro.id_room,ro.title,ro.created_at,ro.description,
         l.key_locat, u.key_uni, if(ro.id_rep is not null, re.key_rep,'') as key_rep, ro.price,
		 us.name_usu, us.email_usu, l.address_locat
         from room ro,location l, university u, republic re, users us
         where l.id_locat = ro.id_locat and
         ro.id_uni = u.id_uni and us.id_usu = ro.id_usu
         and if(ro.id_rep is not null, ro.id_rep = re.id_rep,1) and ro.id_room='{0}'; '''.format(id_room);

        self.cursor.execute(query)
        room = self.cursor.fetchall()

        if(len(room)==0):
            return jsonify(room = None)

        array = []
        for x in room:
            dic = {'id_room':x[0],'title':x[1], 'created_at':x[2],'description':x[3],
             'key_locat':x[4],'key_uni':x[5], 'key_rep':x[6], 'price': str(x[7]),
             'name_owner': x[8], 'email_owner': x[9], 'address': x[10]}
            array.append(dic)
        return jsonify(room = array)

    def send_email_interested(self, email_owner, email_usu, subject, message):
        assunto = 'Contato ache sua república - usuário interessado enviou: {0}'.format(subject)
        mensagem = 'Olá senhor(a), foi solicitado uma mensagem do senhor dono do email: {0} , enviou a seguinte mensagem: {1}'.format(email_usu, message)
        self.base.send_email(email_usu, assunto, mensagem)
        dic = {"answer": "SUCCESS"}
        return jsonify(answer = dic)

    def get_search_rooms(self, location, republic, university, price):
        query = '''
            select distinct ro.id_room, ro.title, ro.price, ro.description, ro.created_at
            FROM room ro inner join location lo on(ro.id_locat=lo.id_locat)
            inner join republic re on(re.id_rep=ro.id_rep or ro.id_rep is null)
            inner join university uni on (uni.id_uni=ro.id_uni)
            where (ro.price <={3}) and (lo.key_locat like '%{0}%')
            or (uni.key_uni like '%{1}%' )
            or (ro.id_rep is not null and re.key_rep like '%{2}%')
            order by ro.created_at desc; '''.format(location, university, republic, price)

        self.cursor.execute(query)
        rooms = self.cursor.fetchall()

        array = []
        for x in rooms:
            dic = {'id_room':x[0],'title':x[1],'price': str(x[2]), 'description':x[3]}
            array.append(dic)
        return jsonify(rooms = array)
