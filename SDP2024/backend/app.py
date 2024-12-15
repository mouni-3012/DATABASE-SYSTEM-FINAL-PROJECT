from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sqlite3
from sql_queries import (
    CREATE_TABLE_QUERY,
    INSERT_PAYMENT_QUERY,
    SELECT_ALL_PAYMENTS_QUERY,
    SELECT_PAYMENT_BY_ID_QUERY,
    UPDATE_PAYMENT_QUERY,
    DELETE_PAYMENT_QUERY,
)

app = Flask(__name__)
CORS(app)


os.makedirs("backend", exist_ok=True)

db_path = os.path.join("backend", "db.sqlite3")


def init_db():
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(CREATE_TABLE_QUERY)
        conn.commit()


init_db()


@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Tax Payment Tracker!"})



@app.route("/payments", methods=["POST"])
def add_payment():
    data = request.json
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(INSERT_PAYMENT_QUERY, (
            data['company'], data['amount'], data.get('payment_date', None),
            data['status'], data['due_date']
        ))
        conn.commit()
    return jsonify({"message": "Tax payment record added successfully!"}), 201



@app.route("/payments", methods=["GET"])
def get_payments():
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(SELECT_ALL_PAYMENTS_QUERY)
        rows = cursor.fetchall()
        payments = []
        for row in rows:
            payments.append({
                "id": row[0],
                "company": row[1],
                "amount": row[2],
                "payment_date": row[3],
                "status": row[4],
                "due_date": row[5]
            })
    return jsonify(payments)



@app.route("/payments/<int:id>", methods=["PUT"])
def update_payment(id):
    data = request.json
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(UPDATE_PAYMENT_QUERY, (
            data['company'], data['amount'], data.get('payment_date', None),
            data['status'], data['due_date'], id
        ))
        conn.commit()
    return jsonify({"message": f"Tax payment record with ID {id} updated successfully!"})



@app.route("/payments/<int:id>", methods=["DELETE"])
def delete_payment(id):
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(DELETE_PAYMENT_QUERY, (id,))
        conn.commit()
    return jsonify({"message": f"Tax payment record with ID {id} deleted successfully!"}), 200

@app.route("/payments/<int:id>", methods=["GET"])
def get_payment_by_id(id):
    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(SELECT_PAYMENT_BY_ID_QUERY, (id,))
        row = cursor.fetchone()
        if row:
            payment = {
                "id": row[0],
                "company": row[1],
                "amount": row[2],
                "payment_date": row[3],
                "status": row[4],
                "due_date": row[5]
            }
            return jsonify(payment), 200
        else:
            return jsonify({"message": f"Tax payment record with ID {id} not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
