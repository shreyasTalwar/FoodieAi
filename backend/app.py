import os # reload trigger
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from backend.config import Config
from backend.models import db, User, Category, Food, KBDocument
from backend.routes.auth import auth_bp
from backend.routes.foods import foods_bp
from backend.routes.cart import cart_bp
from backend.routes.orders import orders_bp
from backend.routes.ai import ai_bp
from backend.services.rag import index_document

def create_app():
    app = Flask(__name__)
    import os
    print("1:", os.getenv("DATABASE_URL"))
    app.config.from_object(Config)
    print("2:", Config.SQLALCHEMY_DATABASE_URI)
    print("3:", app.config["SQLALCHEMY_DATABASE_URI"])
    
    if os.getenv("DATABASE_URL"):
        app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
        
    print("4:", app.config["SQLALCHEMY_DATABASE_URI"])
    
    # Enable CORS
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Initialize Database & JWT
    db.init_app(app)
    jwt = JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(foods_bp, url_prefix='/api')
    app.register_blueprint(cart_bp, url_prefix='/api')
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(ai_bp, url_prefix='/api')
    
    # Create tables and seed data
    import traceback
    with app.app_context():
        try:
            db.create_all()
            seed_data()
        except Exception as e:
            print(f"Error creating database tables: {e}")
            traceback.print_exc()
            
    @app.route('/')
    def index():
        return jsonify({'message': 'Welcome to FoodieAI API'}), 200
        
    return app

def seed_data():
    # 1. Seed Admin & Customer if not present
    admin = User.query.filter_by(email='admin@foodieai.com').first()
    if not admin:
        admin = User(username='Admin Chief', email='admin@foodieai.com', role='admin')
        admin.set_password('admin123')
        db.session.add(admin)
        
    customer = User.query.filter_by(email='customer@foodieai.com').first()
    if not customer:
        customer = User(username='Foodie Lover', email='customer@foodieai.com', role='customer')
        customer.set_password('customer123')
        db.session.add(customer)
        
    # 2. Seed Categories
    categories = ['Pizzas', 'Burgers', 'Sides', 'Beverages', 'Desserts', 'South Indian']
    cat_objs = {}
    for cat_name in categories:
        cat = Category.query.filter_by(name=cat_name).first()
        if not cat:
            cat = Category(name=cat_name)
            db.session.add(cat)
            db.session.flush() # get ID
        cat_objs[cat_name] = cat
        
    db.session.commit()
    
    # 3. Seed Menu Items
    foods_data = [
        {
            'name': 'Margherita Pizza',
            'description': 'Classic pizza with fresh mozzarella, cherry tomatoes, and aromatic basil leaves.',
            'price': 249.00,
            'rating': 4.7,
            'category': 'Pizzas',
            'image_url': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop',
            'ingredients': 'Wheat flour, Yeast, Mozzarella cheese, Tomato sauce, Olive oil, Basil leaves',
            'nutrition': 'Calories: 266 kcal, Protein: 11g, Carbs: 30g, Fat: 10g',
            'allergens': 'Gluten, Dairy'
        },
        {
            'name': 'Double Cheese Chicken Burger',
            'description': 'Succulent double grilled chicken patties with melted cheddar cheese, lettuce, and our secret burger sauce.',
            'price': 299.00,
            'rating': 4.9,
            'category': 'Burgers',
            'image_url': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop',
            'ingredients': 'Brioche bun, Chicken patty, Cheddar cheese, Lettuce, Pickles, Secret mayo sauce',
            'nutrition': 'Calories: 540 kcal, Protein: 32g, Carbs: 40g, Fat: 22g',
            'allergens': 'Gluten, Dairy, Egg'
        },
        {
            'name': 'Loaded Potato Wedges',
            'description': 'Crispy golden potato wedges loaded with liquid cheese sauce and fresh chives.',
            'price': 149.00,
            'rating': 4.5,
            'category': 'Sides',
            'image_url': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop',
            'ingredients': 'Potatoes, Vegetable oil, Cheddar cheese sauce, Garlic powder, Paprika, Chives',
            'nutrition': 'Calories: 320 kcal, Protein: 6g, Carbs: 45g, Fat: 14g',
            'allergens': 'Dairy'
        },
        {
            'name': 'Mint Mojito',
            'description': 'Refreshing cold beverage made with fresh mint leaves, lime juice, brown sugar, and sparkling club soda.',
            'price': 99.00,
            'rating': 4.6,
            'category': 'Beverages',
            'image_url': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop',
            'ingredients': 'Mint leaves, Lime, Brown sugar, Club soda, Crushed ice',
            'nutrition': 'Calories: 85 kcal, Protein: 0g, Carbs: 21g, Fat: 0g',
            'allergens': 'None'
        },
        {
            'name': 'Mango Lassi',
            'description': 'Traditional rich and creamy yogurt-based drink flavored with sweet ripe mango pulp, cardamom, and saffron threads.',
            'price': 120.00,
            'rating': 4.8,
            'category': 'Beverages',
            'image_url': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop',
            'ingredients': 'Sweet yogurt, Ripe mango pulp, Sugar, Crushed cardamom, Saffron',
            'nutrition': 'Calories: 180 kcal, Protein: 4g, Carbs: 35g, Fat: 3g',
            'allergens': 'Dairy'
        },
        {
            'name': 'Iced Caramel Macchiato',
            'description': 'Rich, full-bodied espresso combined with vanilla-flavored syrup, milk, and ice, topped with a sweet caramel drizzle.',
            'price': 149.00,
            'rating': 4.7,
            'category': 'Beverages',
            'image_url': 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&auto=format&fit=crop',
            'ingredients': 'Espresso, Whole milk, Caramel drizzle, Vanilla syrup, Ice',
            'nutrition': 'Calories: 250 kcal, Protein: 6g, Carbs: 38g, Fat: 7g',
            'allergens': 'Dairy'
        },
        {
            'name': 'Classic Masala Chai',
            'description': 'Spiced Indian milk tea brewed hot with aromatic spices like cardamom, fresh ginger, cloves, and black pepper.',
            'price': 79.00,
            'rating': 4.9,
            'category': 'Beverages',
            'image_url': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop',
            'ingredients': 'Assam black tea leaves, Whole milk, Ginger root, Cardamom pods, Cinnamon bark, Cloves, Sugar',
            'nutrition': 'Calories: 120 kcal, Protein: 3g, Carbs: 18g, Fat: 2g',
            'allergens': 'Dairy'
        },
        {
            'name': 'Chocolate Lava Cake',
            'description': 'Decadent chocolate cake with a rich molten liquid chocolate center. Served warm.',
            'price': 179.00,
            'rating': 4.8,
            'category': 'Desserts',
            'image_url': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop',
            'ingredients': 'Cocoa powder, Dark chocolate, Butter, Sugar, Eggs, Flour',
            'nutrition': 'Calories: 410 kcal, Protein: 5g, Carbs: 48g, Fat: 24g',
            'allergens': 'Gluten, Dairy, Egg'
        },
        {
            'name': 'Masala Dosa',
            'description': 'Crispy golden rice crepe filled with seasoned mashed potatoes. Served with warm sambar and fresh coconut chutney.',
            'price': 120.00,
            'rating': 4.8,
            'category': 'South Indian',
            'image_url': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop',
            'ingredients': 'Rice, Black lentils, Fenugreek, Potatoes, Mustard seeds, Curry leaves, Turmeric',
            'nutrition': 'Calories: 350 kcal, Protein: 6g, Carbs: 65g, Fat: 8g',
            'allergens': 'None'
        },
        {
            'name': 'Idli Sambar',
            'description': 'Steamed fluffy rice and lentil cakes served with a rich, spiced lentil vegetable soup (sambar) and coconut chutney.',
            'price': 80.00,
            'rating': 4.7,
            'category': 'South Indian',
            'image_url': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop',
            'ingredients': 'Rice, Black lentils, Fenugreek, Tamarind, Toor dal, Mixed vegetables, Sambar spice blend',
            'nutrition': 'Calories: 210 kcal, Protein: 8g, Carbs: 42g, Fat: 2g',
            'allergens': 'None'
        },
        {
            'name': 'Crispy Medu Vada',
            'description': 'Crispy deep-fried savory lentil donuts, seasoned with pepper, curry leaves, and fresh ginger. Served with sambar.',
            'price': 90.00,
            'rating': 4.6,
            'category': 'South Indian',
            'image_url': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop',
            'ingredients': 'Black lentils (urad dal), Green chilies, Curry leaves, Black pepper, Ginger, Vegetable oil',
            'nutrition': 'Calories: 290 kcal, Protein: 7g, Carbs: 38g, Fat: 12g',
            'allergens': 'None'
        }
    ]
    
    for food in foods_data:
        existing = Food.query.filter_by(name=food['name']).first()
        if not existing:
            new_food = Food(
                name=food['name'],
                description=food['description'],
                price=food['price'],
                rating=food['rating'],
                category_id=cat_objs[food['category']].id,
                image_url=food['image_url'],
                ingredients=food['ingredients'],
                nutrition=food['nutrition'],
                allergens=food['allergens']
            )
            db.session.add(new_food)
            
    db.session.commit()
    
    # 4. Seed Default FAQ Documents for RAG
    faq_docs = [
        {
            'filename': 'restaurant_hours.txt',
            'content': (
                "FoodieAI Restaurant Hours:\n"
                "We are open daily to serve you the best gourmet meals!\n"
                "Monday to Thursday: 11:00 AM - 10:00 PM\n"
                "Friday to Saturday: 11:00 AM - 11:00 PM\n"
                "Sunday: 12:00 PM - 9:00 PM\n"
                "Please note that delivery orders stop 30 minutes before closing time."
            )
        },
        {
            'filename': 'refund_policy.txt',
            'content': (
                "FoodieAI Refund and Return Policy:\n"
                "We take extreme pride in our quality. If you receive an incorrect order or the food quality is not "
                "satisfactory, you are eligible for a replacement or a full refund.\n"
                "To request a refund, please report the issue within 2 hours of delivery via our Support line or by emailing "
                "refunds@foodieai.com with your order number. Approved refunds are credited back to your original payment method "
                "within 3-5 business days."
            )
        },
        {
            'filename': 'delivery_policies.txt',
            'content': (
                "FoodieAI Delivery Rates and Range:\n"
                "We offer free delivery for all orders above ₹499.\n"
                "For orders under ₹499, a flat delivery fee of ₹40 is applicable.\n"
                "We deliver to all locations within a 10 km radius of our central kitchen. Delivery takes between 30 to 45 minutes "
                "depending on traffic conditions and weather."
            )
        }
    ]
    
    for doc in faq_docs:
        existing = KBDocument.query.filter_by(filename=doc['filename']).first()
        if not existing:
            index_document(doc['filename'], doc['content'])

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
