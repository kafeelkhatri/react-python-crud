import pymysql
from app import app
from config import mysql
from flask import jsonify
from flask import flash, request

@app.route('/create', methods=['POST'])
def create_emp():
    try:        
        _json = request.json
        _name = _json['name']
        _age = _json['age']
        if _name and _age and request.method == 'POST':
            conn = mysql.connect()
            cursor = conn.cursor(pymysql.cursors.DictCursor)		
            sqlQuery = "INSERT INTO users(name, age) VALUES(%s, %s)"
            bindData = (_name, _age)            
            cursor.execute(sqlQuery, bindData)
            conn.commit()
            respone = jsonify('User added successfully!')
            respone.status_code = 200
            return respone
        else:
            return showMessage()
    except Exception as e:
        print(e)
    finally:
        cursor.close() 
        conn.close()          
     
@app.route('/emp')
def emp():
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT id, name, age FROM users")
        empRows = cursor.fetchall()
        respone = jsonify(empRows)
        respone.status_code = 200
        return respone
    except Exception as e:
        print(e)
    finally:
        cursor.close() 
        conn.close()  

@app.route('/emp_data/',methods=['POST'])
def emp_details():
    try:
        _json = request.json
        _id = _json['id']
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)		
        sqlQuery = "SELECT * FROM users WHERE id =%s"
        bindData = (_id)            
        cursor.execute(sqlQuery, bindData)
        empRow = cursor.fetchone()
        respone = jsonify(empRow)
        respone.status_code = 200
        return respone
    except Exception as e:
        print(e)
    finally:
        cursor.close() 
        conn.close() 

@app.route('/update', methods=['PUT'])
def update_emp():
    try:
        _json = request.json
        _id = _json['id']
        _name = _json['name']
        _age = _json['age']
        if _name and _age and _id and request.method == 'PUT':			
            sqlQuery = "UPDATE users SET name=%s, age=%s WHERE id=%s"
            bindData = (_name, _age, _id,)
            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.execute(sqlQuery, bindData)
            conn.commit()
            respone = jsonify('User updated successfully!')
            respone.status_code = 200
            return respone
        else:
            return showMessage()
    except Exception as e:
        print(e)
    finally:
        cursor.close() 
        conn.close() 

@app.route('/delete', methods=['POST'])
def _delete():
    try:
        _json = request.json
        _id = _json['id']
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)		
        sqlQuery = "DELETE FROM users WHERE id =%s"
        bindData = (_id)            
        cursor.execute(sqlQuery, bindData)
        conn.commit()
        # empRow = cursor.fetchone()
        respone = jsonify('User Deleted')
        respone.status_code = 200
        return respone
    except Exception as e:
        print(e)
    finally:
        cursor.close() 
        conn.close() 

        
       
@app.errorhandler(404)
def showMessage(error=None):
    message = {
        'status': 404,
        'message': 'Record not found: ' + request.url,
    }
    respone = jsonify(message)
    respone.status_code = 404
    return respone
        
if __name__ == "__main__":
    app.run()