# -*- coding: UTF-8 -*-
from flask import Flask
from base import base
from users import user_functions
from locations import location_functions
from universities import university_functions
from republics import republic_functions
from flask.ext.cors import CORS

app = Flask(__name__)
cors = CORS(app)

base = base.Base()
user = user_functions.User(base)
location = location_functions.Location(base)
university = university_functions.University(base)
republic = republic_functions.Republic(base)

@app.route('/login/<email>/<password>')
def login(email, password):
    return user.login(email, password)

@app.route('/createUser/<email>/<password>/<name>/<phone>', methods =["POST"])
def new_user(email ,password, name, phone):
    return user.new_user(email, password, name, phone)

@app.route('/updateUser/<email>/<name>/<phone>/<int:id_usu>', methods =["POST"])
def update_user(name, email, phone, id_usu):
    return user.update_user(name, email, phone, id_usu)

@app.route('/deleteUser/<int:id_usu>', methods =["POST"])
def delete_user(id_usu):
    return user.delete_user(id_usu)

@app.route('/updatePassword/<password>/<int:id_usu>', methods =["POST"])
def update_password_user(password, id_usu):
    return user.update_password_user(password, id_usu)

@app.route('/resetPassword/<email_usu>', methods = ["POST"])
def reset_password(email_usu):
    return user.reset_password(email_usu)

@app.route('/createLocation/<city_locat>/<state_locat>/<adress_locat>/<int:id_usu>', methods = ["POST"])
def create_location(city_locat, state_locat, adress_locat, id_usu):
    return location.create_location(city_locat, state_locat, adress_locat, id_usu)

@app.route('/getLocationsById/<int:id_usu>')
def get_locations(id_usu):
    return location.get_locations_by_id(id_usu)

@app.route('/updateLocation/<city_locat>/<state_locat>/<address_locat>/<int:id_locat>/<int:id_usu>', methods = ["POST"])
def update_location(city_locat, state_locat, address_locat, id_locat, id_usu):
    return location.update_location(city_locat, state_locat, address_locat, id_locat, id_usu)

@app.route('/deleteLocation/<int:id_locat>', methods=["POST"])
def delete_location(id_locat):
    return location.delete_location(id_locat)

@app.route('/getLocationKeys/')
def get_location_keys():
    return location.get_location_keys()

@app.route('/createUniversity/<name>/<key_locat>/<int:id_usu>', methods=["POST"])
def new_university(name, key_locat, id_usu):
    return university.new_university(name, key_locat, id_usu)

@app.route('/getUniversitiesById/<int:id_usu>')
def get_universities_by_id(id_usu):
    return university.get_universities_by_id(id_usu)

@app.route('/updateUniversity/<name_uni>/<key_locat_uni>/<int:id_uni>/<int:id_usu>', methods=["POST"])
def update_university(name_uni, key_locat_uni, id_uni, id_usu):
    return university.update_university(name_uni, key_locat_uni, id_uni, id_usu)

@app.route('/deleteUniversity/<key_locat>/<int:id_usu>', methods=["POST"])
def delte_university(key_locat, id_usu):
    return university.delete_university(key_locat, id_usu)

@app.route('/createRepublic/<name>/<key_locat>/<int:id_usu>', methods=["POST"])
def new_republic(name, key_locat, id_usu):
    return republic.new_republic(name, key_locat, id_usu)

@app.route('/getRepublicsById/<int:id_usu>')
def get_republics_by_id(id_usu):
    return republic.get_republics_by_id(id_usu)

@app.route('/updateRepublic/<name>/<key_locat>/<int:id_rep>/<int:id_usu>', methods=["POST"])
def update_republic(name, key_locat, id_rep, id_usu):
    return republic.update_republic(name, key_locat, id_rep, id_usu)

#mudar o ip para testar
if __name__ == "__main__":
    app.run(host="192.168.1.106", debug=True, use_reloader=True)
