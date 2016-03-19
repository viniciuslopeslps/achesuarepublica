from flask import Flask
from base import base
from users import user_functions
from locations import location_functions
from flask.ext.cors import CORS

app = Flask(__name__)
cors = CORS(app)

base = base.Base()
user = user_functions.User(base)
location = location_functions.Location(base)

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

@app.route('/createLocation/<city_locat>/<state_locat>/<adress_locat>/<int:number_locat>/<int:id_usu>', methods = ["POST"])
def create_location(city_locat, state_locat, adress_locat, number_locat, id_usu):
    return location.create_location(city_locat, state_locat, adress_locat, number_locat, id_usu)

@app.route('/getLocations/<int:id_usu>')
def get_locations(id_usu):
    return location.get_locations(id_usu)

@app.route('/updateLocation/<city_locat>/<state_locat>/<address_locat>/<int:number_locat>/<int:id_locat>/<int:id_usu>', methods = ["POST"])
def update_location(city_locat, state_locat, address_locat, number_locat, id_locat, id_usu):
    return location.update_location(city_locat, state_locat, address_locat, number_locat, id_locat, id_usu)


#mudar o ip para testar
if __name__ == "__main__":
    app.run(host="192.168.1.105", debug=True, use_reloader=True)
