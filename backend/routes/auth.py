from flask import Blueprint, request, jsonify
from backend.models import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import re

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'customer')  # Default role is customer
    
    if not username or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
        
    if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
        return jsonify({'message': 'Invalid email address'}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User with this email already exists'}), 409
        
    new_user = User(username=username, email=email, role=role)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()
    
    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'user': new_user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid email or password'}), 401
        
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    if request.method == 'GET':
        return jsonify(user.to_dict()), 200
        
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if username:
        user.username = username
    if email:
        # Check uniqueness if email is changed
        if email != user.email:
            existing = User.query.filter_by(email=email).first()
            if existing:
                return jsonify({'message': 'Email already in use'}), 409
            user.email = email
    if password:
        user.set_password(password)
        
    db.session.commit()
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    }), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Flask-JWT-Extended logout is client side by discarding token,
    # but we return a success response.
    return jsonify({'message': 'Logged out successfully'}), 200
