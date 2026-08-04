from flask import Blueprint, request, jsonify
from backend.models import db, CartItem, Food
from flask_jwt_extended import jwt_required, get_jwt_identity

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = int(get_jwt_identity())
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    total_price = sum(item.food.price * item.quantity for item in cart_items if item.food)
    
    return jsonify({
        'items': [item.to_dict() for item in cart_items],
        'total_price': total_price
    }), 200

@cart_bp.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    food_id = data.get('food_id')
    quantity = data.get('quantity', 1)
    
    if not food_id:
        return jsonify({'message': 'Food ID required'}), 400
        
    food = Food.query.get(food_id)
    if not food:
        return jsonify({'message': 'Food item not found'}), 404
        
    # Check if item already exists in user's cart
    item = CartItem.query.filter_by(user_id=user_id, food_id=food_id).first()
    if item:
        item.quantity += int(quantity)
    else:
        item = CartItem(user_id=user_id, food_id=food_id, quantity=int(quantity))
        db.session.add(item)
        
    db.session.commit()
    return jsonify({
        'message': 'Item added to cart',
        'item': item.to_dict()
    }), 201

@cart_bp.route('/cart/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    user_id = int(get_jwt_identity())
    item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not item:
        return jsonify({'message': 'Cart item not found'}), 404
        
    data = request.get_json() or {}
    quantity = data.get('quantity')
    
    if quantity is None or int(quantity) <= 0:
        return jsonify({'message': 'Valid quantity required'}), 400
        
    item.quantity = int(quantity)
    db.session.commit()
    
    return jsonify({
        'message': 'Cart item updated',
        'item': item.to_dict()
    }), 200

@cart_bp.route('/cart/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_cart_item(item_id):
    user_id = int(get_jwt_identity())
    item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    
    if not item:
        return jsonify({'message': 'Cart item not found'}), 404
        
    db.session.delete(item)
    db.session.commit()
    
    return jsonify({'message': 'Item removed from cart'}), 200

@cart_bp.route('/cart', methods=['DELETE'])
@jwt_required()
def clear_cart():
    user_id = int(get_jwt_identity())
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({'message': 'Cart cleared successfully'}), 200
