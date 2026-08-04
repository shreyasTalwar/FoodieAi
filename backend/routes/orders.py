from flask import Blueprint, request, jsonify
from backend.models import db, Order, OrderItem, CartItem, User
from flask_jwt_extended import jwt_required, get_jwt_identity

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['POST'])
@jwt_required()
def place_order():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    address = data.get('address')
    
    if not address:
        return jsonify({'message': 'Delivery address is required'}), 400
        
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({'message': 'Cart is empty'}), 400
        
    total_price = sum(item.food.price * item.quantity for item in cart_items if item.food)
    
    new_order = Order(user_id=user_id, address=address, total_price=total_price, status='Pending')
    db.session.add(new_order)
    db.session.flush() # Populate new_order.id
    
    for item in cart_items:
        if item.food:
            order_item = OrderItem(
                order_id=new_order.id,
                food_id=item.food_id,
                quantity=item.quantity,
                price=item.food.price
            )
            db.session.add(order_item)
            
    # Clear cart items
    CartItem.query.filter_by(user_id=user_id).delete()
    
    db.session.commit()
    return jsonify({
        'message': 'Order placed successfully',
        'order': new_order.to_dict()
    }), 201

@orders_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    if user.role == 'admin':
        # Admin can view all orders
        orders = Order.query.order_by(Order.created_at.desc()).all()
    else:
        # Customer views their own orders
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
        
    return jsonify([order.to_dict() for order in orders]), 200

@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({'message': 'Order not found'}), 404
        
    # Check permissions: must be the order owner or an admin
    if user.role != 'admin' and order.user_id != user_id:
        return jsonify({'message': 'Access denied'}), 403
        
    return jsonify(order.to_dict()), 200

@orders_bp.route('/orders/<int:order_id>', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
        
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404
        
    data = request.get_json() or {}
    status = data.get('status')
    
    valid_statuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']
    if not status or status not in valid_statuses:
        return jsonify({'message': f'Invalid status. Must be one of {valid_statuses}'}), 400
        
    order.status = status
    db.session.commit()
    
    return jsonify({
        'message': f'Order status updated to {status}',
        'order': order.to_dict()
    }), 200
