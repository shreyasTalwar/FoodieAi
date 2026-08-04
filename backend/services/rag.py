import re
import requests
from flask import current_app
from backend.models import db, KBDocument, Food

# Simple Vector Search using TF-IDF (avoiding complex dependencies while keeping search fully semantic/content-based)
def chunk_text(text, max_chars=800, overlap=150):
    text = re.sub(r'\s+', ' ', text).strip()
    chunks = []
    start = 0
    while start < len(text):
        end = start + max_chars
        if end >= len(text):
            chunks.append(text[start:])
            break
        # Look for the last space/punctuation to split cleanly
        split_at = text.rfind(' ', start, end)
        if split_at != -1 and split_at > start + (max_chars // 2):
            chunks.append(text[start:split_at])
            start = split_at + 1
        else:
            chunks.append(text[start:end])
            start += max_chars - overlap
    return chunks

def index_document(filename, text):
    chunks = chunk_text(text)
    # Remove older chunks of the same file if any
    KBDocument.query.filter_by(filename=filename).delete()
    
    for idx, chunk in enumerate(chunks):
        doc = KBDocument(filename=filename, content=chunk, chunk_index=idx)
        db.session.add(doc)
    db.session.commit()
    return len(chunks)

def get_similar_contexts(query, top_n=4):
    """
    Search both the knowledge base document chunks and the active menu items.
    Computes a simple TF-IDF word overlap score to rank relevance.
    """
    docs = KBDocument.query.all()
    foods = Food.query.all()
    
    candidates = []
    
    # Process KB documents
    for doc in docs:
        candidates.append({
            'source': doc.filename,
            'text': doc.content,
            'type': 'kb'
        })
        
    # Process Menu Items as searchable chunks
    for food in foods:
        food_details = f"Food Item: {food.name}. Description: {food.description}. Price: INR {food.price}. Rating: {food.rating}. Category: {food.category.name if food.category else ''}. Ingredients: {food.ingredients or 'None'}. Nutrition: {food.nutrition or 'None'}. Allergens: {food.allergens or 'None'}."
        candidates.append({
            'source': f"Menu Item: {food.name}",
            'text': food_details,
            'type': 'menu',
            'food': food
        })
        
    if not candidates:
        return []
        
    # Simple word overlap similarity / tf-idf matching
    query_words = set(re.findall(r'\w+', query.lower()))
    if not query_words:
        return candidates[:top_n]
        
    scores = []
    for candidate in candidates:
        cand_text = candidate['text'].lower()
        cand_words = re.findall(r'\w+', cand_text)
        
        # Calculate term frequency
        tf = sum(1 for word in cand_words if word in query_words)
        
        # Boost matches on specific phrases or exact matches
        boost = 0
        if candidate['type'] == 'menu':
            # Boost if food name is in query
            if candidate['food'].name.lower() in query.lower():
                boost += 10
        
        score = tf + boost
        scores.append((score, candidate))
        
    # Sort by score descending
    scores.sort(key=lambda x: x[0], reverse=True)
    
    # Filter out 0-score items if possible, but return top_n
    relevant = [item for score, item in scores if score > 0]
    if not relevant:
        relevant = [item for score, item in scores[:top_n]]
    else:
        relevant = relevant[:top_n]
        
    return relevant

def query_rag(query, api_key=None, model=None):
    """
    Retrieves context and queries OpenRouter API.
    """
    contexts = get_similar_contexts(query)
    context_str = "\n\n".join([f"Source: {c['source']}\nContent: {c['text']}" for c in contexts])
    
    system_prompt = (
        "You are FoodieAI, the warm, professional, and highly knowledgeable AI Assistant for our restaurant. "
        "Your goal is to guide guests through our menu, check ingredients, warn about allergens, explain policies, "
        "and make delightful, personalized recommendations based on the context provided.\n\n"
        "Guidelines:\n"
        "1. Recommend items from the retrieved menu context that match the guest's constraints (e.g. price limits, vegetarian, allergens).\n"
        "2. State the price and details of the recommended menu items explicitly so the guest knows the options.\n"
        "3. Be conversational, polite, and clean. Use markdown (bold text, bullet points) for readability.\n"
        "4. If a question cannot be answered using the provided context, politely suggest contacting support at support@foodieai.com."
    )
    
    user_prompt = f"Context:\n{context_str}\n\nUser Question: {query}\n\nAnswer:"
    
    api_key = api_key or current_app.config['OPENROUTER_API_KEY']
    model = model or current_app.config['OPENROUTER_MODEL']
    
    if not api_key:
        # Fallback to local rule-based response if no key is configured
        return generate_local_response(query, contexts)
        
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "max_tokens": 500
            },
            timeout=10
        )
        if response.status_code == 200:
            res_data = response.json()
            return res_data['choices'][0]['message']['content'].strip()
        else:
            # Fallback on API failure
            return f"Error from OpenRouter: {response.text}. Fallback response:\n{generate_local_response(query, contexts)}"
    except Exception as e:
        return f"Could not connect to OpenRouter ({str(e)}). Here is a summary of relevant details:\n{generate_local_response(query, contexts)}"

def generate_local_response(query, contexts):
    """
    Local fallback response generator based on retrieved contexts.
    """
    if not contexts:
        return "I'm sorry, I couldn't find any information about that in our knowledge base. You can contact support at support@foodieai.com or phone us at +1-800-FOODIE."
        
    # Synthesize answers from top matched context
    best = contexts[0]
    
    if best['type'] == 'menu':
        food = best['food']
        response = f"I found the **{food.name}** on our menu. It belongs to the **{food.category.name}** category.\n"
        response += f"- **Price**: ₹{food.price}\n"
        response += f"- **Description**: {food.description or 'No description available.'}\n"
        if food.ingredients:
            response += f"- **Ingredients**: {food.ingredients}\n"
        if food.nutrition:
            response += f"- **Nutrition**: {food.nutrition}\n"
        if food.allergens:
            response += f"- **Allergen Info**: {food.allergens}\n"
        return response
        
    return f"Based on our restaurant guidelines/FAQs:\n\n{best['text']}"
