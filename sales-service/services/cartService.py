from flask import request
from models import db, CartItem
from services.tokenService import verify_client_token, verify_user_token
from services.authService import authenticate_request

def get_cart_total(user_id):
    """Calcula o total do carrinho de um usuário."""
    total = db.session.query(db.func.sum(CartItem.price * CartItem.quantity)).filter_by(user_id=user_id).scalar()
    return total if total else 0.0

def add_to_cart():
    """Adiciona ou atualiza um livro no carrinho."""
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace("Bearer ", "")
    user_id = authenticate_request()

    if not user_id:
        return {"message": "Usuário não autenticado"}, 401
    
    if not verify_client_token(token):
        return {"message": "Invalid client token"}, 403

    data = request.get_json()
    if not data:
        return {"message": "Request body is required"}, 400

    book_id = data.get("book_id")
    title = data.get("title")
    price = data.get("price")
    quantity = data.get("quantity")

    if not all([user_id, book_id, title, price, quantity]):
        return {"error": "Campos obrigatórios faltando"}, 400

    try:
        cart_item = CartItem.query.filter_by(user_id=user_id, book_id=book_id).first()
        
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(user_id=user_id, book_id=book_id, title=title, price=price, quantity=quantity)
            db.session.add(cart_item)

        db.session.commit()

        return {
            "message": "Item adicionado no carrinho",
            "item": cart_item.to_dict(),
            "cart_total": get_cart_total(user_id)
        }, 201

    except Exception as e:
        db.session.rollback()
        return {"message": "Error adding item to cart", "error": str(e)}, 500

def remove_from_cart():
    """Remove um item do carrinho."""
    user_id = authenticate_request()
    if not user_id:
        return {"message": "Usuário não autenticado"}, 401

    data = request.get_json()
    if not data or "user_id" not in data or "book_id" not in data:
        return {"message": "Campos obrigatórios faltando"}, 400

    user_id = data["user_id"]
    book_id = data["book_id"]

    try:
        cart_item = CartItem.query.filter_by(user_id=user_id, book_id=book_id).first()
        
        if not cart_item:
            return {"message": "Item não encontrado no carrinho"}, 404

        db.session.delete(cart_item)
        db.session.commit()

        return {
            "message": "Item removido do carrinho",
            "cart_total": get_cart_total(user_id)
        }, 200

    except Exception as e:
        db.session.rollback()
        return {"message": "Error removing item from cart", "error": str(e)}, 500

def delete_user_cart(user_id):
    """Remove todos os itens do carrinho de um usuário."""
    user_id = authenticate_request()
    if not user_id:
        return {"message": "Usuário não autenticado"}, 401

    try:
        deleted_items = CartItem.query.filter_by(user_id=user_id).delete()
        db.session.commit()

        return {
            "message": f"Carrinho do usuário {user_id} foi esvaziado",
            "deleted_items": deleted_items
        }, 200

    except Exception as e:
        db.session.rollback()
        return {"message": "Erro ao excluir o carrinho", "error": str(e)}, 500

def update_cart_quantity():
    """Atualiza a quantidade de um item no carrinho."""
    user_id = authenticate_request()
    if not user_id:
        return {"message": "Usuário não autenticado"}, 401

    data = request.get_json()
    if not data or "book_id" not in data or "action" not in data:
        return {"message": "Campos obrigatórios faltando"}, 400

    book_id = data["book_id"]
    action = data["action"]

    try:
        cart_item = CartItem.query.filter_by(user_id=user_id, book_id=book_id).first()
        
        if not cart_item:
            return {"message": "Item não encontrado no carrinho"}, 404

        if action == "increment":
            cart_item.quantity += 1
        elif action == "decrement":
            if cart_item.quantity > 1:
                cart_item.quantity -= 1
            else:
                db.session.delete(cart_item)
                db.session.commit()
                return {"message": "Item removido do carrinho"}, 200
        
        db.session.commit()

        return {
            "message": "Quantidade do item atualizada",
            "item": cart_item.to_dict(),
            "cart_total": get_cart_total(user_id)
        }, 200

    except Exception as e:
        db.session.rollback()
        return {"message": "Error updating cart item", "error": str(e)}, 500

def list_cart(user_id):
    """Lista os itens do carrinho de um usuário."""
    user_id = authenticate_request()
    if not user_id:
        return {"message": "Usuário não autenticado"}, 401

    try:
        cart_items = CartItem.query.filter_by(user_id=user_id).all()
        cart_list = [item.to_dict() for item in cart_items]

        return {
            "cart": cart_list,
            "cart_total": get_cart_total(user_id)
        }, 200

    except Exception as e:
        return {"message": "Error listing cart items", "error": str(e)}, 500