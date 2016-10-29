# -*- coding: UTF-8 -*-
from flask import Flask, request
from base import base
from users import user_functions
from locations import location_functions
from universities import university_functions
from rooms import room_functions
from republics import republic_functions
from flask.ext.cors import CORS

app = Flask(__name__)
cors = CORS(app)

base = base.Base()
user = user_functions.User(base)
location = location_functions.Location(base)
university = university_functions.University(base, location)
republic = republic_functions.Republic(base, location)
room = room_functions.Room(base, location, university, republic)

@app.route('/login/<email>/<password>')
def login(email, password):
    return user.login(email, password)

@app.route('/createUser', methods=["POST"])
def new_user():
    allowed_keys = ['email','password','name','phone']
    keys = base.check_request_params(allowed_keys, request.json)
    return user.new_user(keys['email'], keys['password'], keys['name'], keys['phone'])

@app.route('/updateUser', methods=["PUT"])
def update_user():
    allowed_keys = ['name','email','phone','id_usu']
    keys = base.check_request_params(allowed_keys, request.json)
    return user.update_user(keys['name'], keys['email'], keys['phone'], keys['id_usu'])

@app.route('/deleteUser/<int:id_usu>', methods=["DELETE"])
def delete_user(id_usu):
    return user.delete_user(id_usu)

@app.route('/updatePassword', methods=["PUT"])
def update_password_user():
    allowed_keys = ['password','id_usu']
    keys = base.check_request_params(allowed_keys, request.json)
    return user.update_password_user(keys['password'], keys['id_usu'])

@app.route('/resetPassword', methods=["POST"])
def reset_password():
    allowed_keys = ['email']
    keys = base.check_request_params(allowed_keys, request.json)
    return user.reset_password(keys['email'])

@app.route('/createLocation', methods=["POST"])
def create_location():
    allowed_keys = ['city_locat', 'state_locat', 'id_usu']
    keys = base.check_request_params(allowed_keys, request.json)
    extra_locat = None
    if 'extra_locat' in keys:
        extra_locat = keys['extra_locat']
    return location.create_location(keys['city_locat'], keys['state_locat'], extra_locat, keys['id_usu'])

@app.route('/getLocationsById/<int:id_usu>')
def get_locations(id_usu):
    return location.get_locations_by_id_user(id_usu)

@app.route('/updateLocation', methods=["PUT"])
def update_location():
    allowed_keys = ['city_locat', 'state_locat', 'id_locat', 'id_usu']
    keys = base.check_request_params(allowed_keys, request.json)
    extra_locat = None
    if 'extra_locat' in keys:
        extra_locat = keys['extra_locat']
    return location.update_location(keys['city_locat'], keys['state_locat'], extra_locat, keys['id_locat'], keys['id_usu'])

@app.route('/deleteLocation/<int:id_locat>', methods=["DELETE"])
def delete_location(id_locat):
    return location.delete_location(id_locat)

@app.route('/getLocationKeys/')
def get_location_keys():
    return location.get_location_keys()

@app.route('/createUniversity', methods=["POST"])
def new_university():
    allowed_keys = ['name', 'key_locat', 'id_usu']
    keys = base.check_request_params(allowed_keys, request.json)
    return university.new_university(keys['name'], keys['key_locat'], keys['id_usu'])

@app.route('/getUniversitiesById/<int:id_usu>')
def get_universities_by_id(id_usu):
    return university.get_universities_by_id(id_usu)

@app.route('/updateUniversity', methods=["PUT"])
def update_university():
    allowed_keys = ['name', 'key_locat', 'id_uni', 'id_usu']
    keys = base.check_request_params(allowed_keys, request.json)
    return university.update_university(keys['name'], keys['key_locat'], keys['id_uni'], keys['id_usu'])

@app.route('/deleteUniversity/<key_locat>/<int:id_usu>', methods=["DELETE"])
def delte_university(key_locat, id_usu):
    return university.delete_university(key_locat, id_usu)

@app.route('/getUnivertisyKeys/')
def get_university_keys():
    return university.get_university_keys()

@app.route('/createRepublic', methods=["POST"])
def new_republic():
    allowed_keys = ['name', 'key_locat', 'id_usu']
    keys = base.check_request_params(allowed_keys, request.json)
    return republic.new_republic(keys['name'], keys['key_locat'], keys['id_usu'])

@app.route('/getRepublicsById/<int:id_usu>')
def get_republics_by_id(id_usu):
    return republic.get_republics_by_id(id_usu)

@app.route('/updateRepublic', methods=["PUT"])
def update_republic():
    allowed_keys = ['name', 'key_locat', 'id_usu', 'id_rep']
    keys = base.check_request_params(allowed_keys, request.json)
    return republic.update_republic(keys['name'], keys['key_locat'], keys['id_rep'], keys['id_usu'])

@app.route('/deleteRepublic/<int:id_rep>/<int:id_usu>', methods=["DELETE"])
def delete_republic(id_rep, id_usu):
    return republic.delete_republic(id_rep, id_usu)

@app.route('/getRepublicKeys/')
def get_republic_keys():
    return republic.get_republic_keys()

@app.route('/createRoom', methods=["POST"])
def new_room():
    allowed_keys = ['locat_key', 'university_key', 'republic_key', 'description', 'title', 'id_usu', 'price']
    keys = base.check_request_params(allowed_keys, request.json)
    return room.new_room(keys['locat_key'], keys['university_key'], keys['republic_key'], keys['description'], keys['title'], keys['id_usu'], keys['price'])

@app.route('/getRoomsByUser/<int:id_usu>')
def get_rooms_by_user(id_usu):
    return room.get_rooms_by_user(id_usu)

@app.route('/updateRoom', methods=["PUT"])
def update_room():
    allowed_keys = ['locat_key', 'university_key', 'republic_key', 'description', 'title', 'id_usu', 'price', 'id_room']
    keys = base.check_request_params(allowed_keys, request.json)
    return room.update_room(keys['locat_key'], keys['university_key'], keys['republic_key'], keys['description'], keys['title'], keys['price'], keys['id_usu'], keys['id_room'])

@app.route('/deleteRoom/<int:id_room>/<int:id_usu>', methods=["DELETE"])
def delete_room(id_room, id_usu):
    return room.delete_room(id_room, id_usu)

@app.route('/getRooms/')
def get_rooms():
    return room.get_rooms()

@app.route('/getRoomById/<int:id_room>')
def get_room_by_id(id_room):
    return room.get_room_by_id(id_room)

@app.route('/sendRoomInterested', methods=["POST"])
def send_email_interested():
    allowed_keys = ['email_owner', 'email_usu', 'subject', 'message']
    keys = base.check_request_params(allowed_keys, request.json)
    return room.send_email_interested(keys['email_owner'], keys['email_usu'], keys['subject'], keys['message'])

@app.route('/getSearchRooms/<location>/<republic>/<university>/<int:price>')
def get_search_rooms(location, republic, university, price):
    return room.get_search_rooms(location, republic, university, price)

#mudar o ip para testar
if __name__ == "__main__":
    app.run(host="192.168.1.106", debug=True, use_reloader=True)
