from flask import Blueprint, request, jsonify
from backend.models import db, Food, Category, User
from flask_jwt_extended import jwt_required, get_jwt_identity

foods_bp = Blueprint('foods', __name__)

# --- CATEGORIES ---

@foods_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories]), 200

@foods_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
        
    data = request.get_json() or {}
    name = data.get('name')
    if not name:
        return jsonify({'message': 'Category name required'}), 400
        
    if Category.query.filter_by(name=name).first():
        return jsonify({'message': 'Category already exists'}), 409
        
    category = Category(name=name)
    db.session.add(category)
    db.session.commit()
    
    return jsonify(category.to_dict()), 201

# --- FOOD ITEMS ---

@foods_bp.route('/foods', methods=['GET'])
def get_foods():
    # Filter/Search Query params
    search = request.args.get('search', '')
    category_id = request.args.get('category_id')
    sort_by = request.args.get('sort_by')  # 'price_asc', 'price_desc', 'rating'
    
    query = Food.query
    
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(db.func.lower(Food.name).like(search_term) | db.func.lower(Food.description).like(search_term))
        
    if category_id:
        query = query.filter_by(category_id=category_id)
        
    if sort_by == 'price_asc':
        query = query.order_by(Food.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Food.price.desc())
    elif sort_by == 'rating':
        query = query.order_by(Food.rating.desc())
        
    foods = query.all()
    return jsonify([f.to_dict() for f in foods]), 200

@foods_bp.route('/foods/<int:food_id>', methods=['GET'])
def get_food(food_id):
    food = Food.query.get(food_id)
    if not food:
        return jsonify({'message': 'Food item not found'}), 404
    return jsonify(food.to_dict()), 200

@foods_bp.route('/foods', methods=['POST'])
@jwt_required()
def create_food():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
        
    data = request.get_json() or {}
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    category_id = data.get('category_id')
    image_url = data.get('image_url')
    ingredients = data.get('ingredients')
    nutrition = data.get('nutrition')
    allergens = data.get('allergens')
    
    if not name or price is None or not category_id:
        return jsonify({'message': 'Missing required food fields'}), 400
        
    food = Food(
        name=name,
        description=description,
        price=float(price),
        category_id=int(category_id),
        image_url=image_url,
        ingredients=ingredients,
        nutrition=nutrition,
        allergens=allergens
    )
    db.session.add(food)
    db.session.commit()
    
    return jsonify(food.to_dict()), 201

@foods_bp.route('/foods/<int:food_id>', methods=['PUT'])
@jwt_required()
def update_food(food_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
        
    food = Food.query.get(food_id)
    if not food:
        return jsonify({'message': 'Food item not found'}), 404
        
    data = request.get_json() or {}
    
    if 'name' in data:
        food.name = data['name']
    if 'description' in data:
        food.description = data['description']
    if 'price' in data:
        food.price = float(data['price'])
    if 'category_id' in data:
        food.category_id = int(data['category_id'])
    if 'image_url' in data:
        food.image_url = data['image_url']
    if 'ingredients' in data:
        food.ingredients = data['ingredients']
    if 'nutrition' in data:
        food.nutrition = data['nutrition']
    if 'allergens' in data:
        food.allergens = data['allergens']
    if 'rating' in data:
        food.rating = float(data['rating'])
        
    db.session.commit()
    return jsonify(food.to_dict()), 200

@foods_bp.route('/foods/<int:food_id>', methods=['DELETE'])
@jwt_required()
def delete_food(food_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
        
    food = Food.query.get(food_id)
    if not food:
        return jsonify({'message': 'Food item not found'}), 404
        
    db.session.delete(food)
    db.session.commit()
    return jsonify({'message': 'Food item deleted successfully'}), 200
