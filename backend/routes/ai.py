from flask import Blueprint, request, jsonify, current_app
from backend.models import db, KBDocument, User
from backend.services.rag import index_document, query_rag
from flask_jwt_extended import jwt_required, get_jwt_identity
import os

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    message = data.get('message')
    history = data.get('history') or []
    api_key = data.get('api_key') or request.headers.get('X-Openrouter-Api-Key')
    
    if not message:
        return jsonify({'message': 'Query message required'}), 400
        
    response_text = query_rag(message, api_key=api_key, history=history)
    return jsonify({
        'reply': response_text
    }), 200

@ai_bp.route('/knowledge-base', methods=['POST'])
@jwt_required()
def upload_kb():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
        
    if 'file' not in request.files:
        return jsonify({'message': 'No file uploaded'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
        
    if file:
        filename = file.filename
        content = file.read().decode('utf-8', errors='ignore')
        
        # Save file to uploads folder
        upload_path = current_app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_path):
            os.makedirs(upload_path)
            
        file_path = os.path.join(upload_path, filename)
        file.seek(0) # reset pointer to save file
        file.save(file_path)
        
        # Index document into our database for vector matching
        num_chunks = index_document(filename, content)
        
        return jsonify({
            'message': f'Document {filename} indexed successfully',
            'chunks': num_chunks
        }), 200

@ai_bp.route('/knowledge-base', methods=['GET'])
@jwt_required()
def get_kb_documents():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
        
    # Get unique filenames from db
    docs = db.session.query(KBDocument.filename).distinct().all()
    filenames = [doc[0] for doc in docs]
    return jsonify(filenames), 200

@ai_bp.route('/knowledge-base/<string:filename>', methods=['DELETE'])
@jwt_required()
def delete_kb_document(filename):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
        
    KBDocument.query.filter_by(filename=filename).delete()
    db.session.commit()
    
    # Remove file from disk
    upload_path = current_app.config['UPLOAD_FOLDER']
    file_path = os.path.join(upload_path, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        
    return jsonify({'message': f'Document {filename} deleted successfully'}), 200
