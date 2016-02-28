#GRANT SELECT, INSERT, UPDATE, DELETE, LOCK TABLES ON gasfootprint.* TO root@localhost IDENTIFIED by 'root';

import os, time, json
from flask import (
    Flask, request, current_app, send_from_directory, render_template
)
from flaskext.mysql import MySQL

mysql = MySQL()
app = Flask("gasfootprint")

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'root'
app.config['MYSQL_DATABASE_DB'] = 'gasfootprint'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))

@app.route("/")
def index():
    return render_template("index.html")

conn = mysql.connect()
cursor = conn.cursor()

@app.route("/cadastro", methods =["GET","POST"])
def new_user():
    if request.method == "POST":
        dados = request.form.to_dict()
        cursor.execute("insert into user values (0,'{0}','{1}','{2}');".format(dados['name'],dados['email'],dados['password']))
        conn.commit()
    return render_template("new_user.html")

if __name__ == "__main__":
    app.run(debug=True, use_reloader=True)
