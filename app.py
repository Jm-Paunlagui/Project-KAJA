# imports
# prerequisite: Python 3, virtualenv, pip, MongoDB Community Server

from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager, create_access_token

# jwt_required, get_jwt_identity

# creates the Flask instance.
app = Flask(__name__)

# DATABASE NAME
app.config['MONGO_DBNAME'] = 'electric_calculator'

# DATABASE URI is similar to a URL, and is supplied as a parameter
# to the mongo shell, Compass, and the MongoDB drivers when connecting to a MongoDB deployment
# PyMongo connects to the MongoDB server running on port 27017 on localhost, to the database named electric_calculator
# This database is exposed as the "db" attribute.
app.config['MONGO_URI'] = 'mongodb+srv://yohan11:LvKPLCVad9odyeR2@cluster0.5ieal.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

# Setup the Flask-JWT-Extended extension
app.config[
    'JWT_SECRET_KEY'] = 'K*)-DGpJiPiNvfWkCS@Cr=aL}v;u6_TK%})Sf6TE$RW=9xEfg'  # Change this!, its just a random text

# PyMongo client instance
# Manages MongoDB connections for your Flask app.
mongo = PyMongo(app)

# Bcrypt class container for password hashing and checking logic using bcrypt, of course.
# This class may be used to initialize your Flask app object. The purpose is to provide
# a simple interface for overriding Werkzeug’s built-in password hashing utilities.
bcrypt = Bcrypt(app)

# An object used to hold JWT settings and callback functions for the Flask-JWT-Extended extension.
# Instances of JWTManager are not bound to specific apps, so you can create one in the main body
# of your code and then bind it to your app in a factory function.
jwt = JWTManager(app)

# Initialize the Flask-Cors extension with default arguments in order to
# allow CORS for all domains on all routes
CORS(app, resource={
    r"/*": {
        "origins": "*"
    }
})


# REGISTER ROUTE
@app.route('/users/register', methods=["POST"])
@cross_origin(origin='localhost')
def register():
    # users collection in the database
    users = mongo.db.users
    # Gets the user input from the front-end
    name = request.get_json()['name']
    email = request.get_json()['email']
    # Generates encrypted password
    password = bcrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')
    now = datetime.now()
    created_at = now.strftime("%A, %d %B %Y at %I:%M %p")

    # User Object
    user_id = {
        'name': name,
        'email': email,
        'password': password,
        'role': "subscriber",
        'created_at': created_at,
    }

    # Checks for existing email addresses
    if users.find_one({"email": user_id['email']}):
        print(user_id['email'] + " is already in use!")
        return jsonify({"errors": user_id['email'] + " is already in use!"}), 400
    else:
        # Saves to the Database
        users.insert(user_id)
        # Success message
        print(user_id)
        return jsonify({"message": "Sign up SUCCESS! " + user_id['email']}), 200


# LOGIN ROUTE
# Create a route to authenticate your users and return JWTs.
@app.route('/users/login', methods=['POST'])
@cross_origin(origin='localhost')
def login():
    # users collection in the database
    users = mongo.db.users
    # Gets the user input from the front-end
    email = request.get_json()['email']
    password = request.get_json()['password']
    # Searches for the user
    response = users.find_one({'email': email})

    # if it finds the email to the database then decode the password and create a token to
    # enable the user to login/
    if response:
        if bcrypt.check_password_hash(response['password'], password):  # Decode hashed password
            # Creates the token to enable the user to login
            # The create_access_token() function is used to actually generate the JWT.
            access_token = create_access_token(identity={
                'name': response['name'],
                'email': response['email'],
                'created_at': response['created_at']
            })
            # return a token back to the client

            result = jsonify({"token": access_token, "name": email}), 200
        else:
            # if the user enters invalid credentials
            print("Invalid")
            result = jsonify({"errors": "Invalid username or password"}), 401
    else:
        # No record found
        print("No record found")
        result = jsonify({"errors": "No record found"}), 401

    print(result)
    return result


# Calculate Route
@app.route('/calculate', methods=['POST'])
@cross_origin(origin='localhost')
def calculate():
    # Getting the kWh value from the front-end
    kwh = float(request.get_json()['kWh'])

    # GENERATION CHARGE
    generation_charge = ((kwh * 4.5474) + (kwh * 0.0191) + (kwh * -0.0024))
    r_generation_charge = round(generation_charge, 2)

    # TRANSMISSION CHARGE
    transmission = (kwh * 0.7486)
    r_transmission = round(transmission, 2)

    # SYSTEM LOSS
    system_loss_charge = (kwh * 0.4067)
    r_system_loss_charge = round(system_loss_charge, 2)

    # DISTRIBUTION CHARGE
    distribution_charge = ((kwh * 1.0012) + ((kwh * 0.3377) + 5) + ((kwh * 0.5085) + 16.73) + (kwh * -0.2761))
    r_distribution_charge = round(distribution_charge, 2)

    # SUBSIDIES
    lifeline_discount = (generation_charge + transmission + system_loss_charge + distribution_charge) * -0.20
    r_lifeline_discount = round(lifeline_discount, 2)

    # GOVERNMENT TAXES
    value_added_tax = ((generation_charge * 0.1129) + ((kwh * 0.0191) * 0.0780) + ((kwh * -0.0024) * 0.1733) +
                       (transmission * 0.1028) + (system_loss_charge * 0.1114) + (distribution_charge * 0.12) +
                       (lifeline_discount * 0.12))
    r_value_added_tax = round(value_added_tax, 2)

    # UNIVERSAL CHARGES
    universal_charge = ((kwh * 0.1544) + (kwh * 0.0017) + (kwh * 0.0428))
    r_universal_charge = round(universal_charge, 2)

    # FIT-ALL (RENEWABLE)
    fit_all = kwh * 0.0983
    r_fit_all = round(fit_all, 2)

    # TOTAL PRICE
    total_price = (r_generation_charge + r_transmission + r_system_loss_charge + r_distribution_charge +
                   r_lifeline_discount + r_value_added_tax + r_universal_charge + r_fit_all)
    r_total_price = round(total_price, 2)

    print(r_total_price)
    # Returns the computed kWh in json format
    return jsonify({"generation_charge": r_generation_charge, "transmission": r_transmission,
                    "system_loss_charge": r_system_loss_charge, "distribution_charge": r_distribution_charge,
                    "lifeline_discount": r_lifeline_discount, "value_added_tax": r_value_added_tax,
                    "universal_charge": r_universal_charge, "fit_all": r_fit_all, "price": r_total_price})


# Save Computation details
@app.route('/save/computation', methods=['POST'])
@cross_origin(origin='localhost')
def save_computation():
    # computation collection in the database
    saving_computation = mongo.db.computation_data
    # Getting the kWh, Estimated Price to save us history
    kwh = request.get_json()['kWh']
    estimated_price = request.get_json()['price']
    # Date
    now = datetime.now()
    computed_at = now.strftime("%A, %d %B %Y at %I:%M %p")

    computation = {
        'kWh': kwh,
        'estimated_price': estimated_price,
        'computed_at': computed_at
    }

    saving_computation.insert(computation)
    return jsonify({"message": "Success!"})


# Getting Computed bills
@app.route('/history', methods=['GET'])
def history():
    # finding the saved computation
    saved_datas = mongo.db.computation_data.find()
    # Setting an empty array
    resp = []

    # returns a Cursor object, loop though the documents to build out an array of documents that will reflect
    # all of the documents in the database. Finally, return as json.
    for saved in saved_datas:
        saved['_id'] = str(saved['_id'])
        resp.append(saved)
    return jsonify(resp)


# Deleting history
@app.route('/delete/<string:data_id>', methods=['DELETE'])
@cross_origin()
def delete(data_id):
    # This will search for and delete the entry with the provided ID.
    mongo.db.computation_data.delete_many({"_id": ObjectId(data_id)})
    print(ObjectId(data_id))
    # returns as json
    return jsonify({'status': 'Bill ID: ' + data_id + ' has been Successfully Removed!'})


#  __name__ will be equal to "__main__".
#  That means the if conditional statement is satisfied and the app.run() method will be executed.
if __name__ == '__main__':
    app.run(debug=True)
