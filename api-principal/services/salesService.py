import requests
from flask_jwt_extended import get_jwt_identity, get_jwt_header
from flask import current_app, request
from services.tokenService import TokenService

def add_to_cart(data):
    """
    Realiza uma requisição para o micro serviço de vendas para adicionar um livro ao carrinho.
    O token JWT é repassado para que o micro serviço também valide a autenticidade.
    """
    sales_url = current_app.config.get("SALES_SERVICE_URL")
    user_id = get_jwt_identity()

    book_id = data.get("book_id")
    title = data.get("title")
    price = data.get("price")
    quantity = data.get("quantity")

    if not book_id:
        return {"mensagem": "ID do livro é obrigatório."}, 400
    if not title:
        return {"mensagem": "Titulo é obrigatório."}, 400
    if not price:
        return {"mensagem": "Preço é obrigatório."}, 400
    if not quantity:
        return {"mensagem": "Quantidade é obrigatório."}, 400
    
    payload = {
        "user_id": user_id,
        "book_id": book_id,
        "title": title,
        "price": price,
        "quantity": quantity
    }

    client_token = TokenService.generate_client_token()
    user_token = request.headers.get("Authorization").replace("Bearer ", "")

    headers = {
        "Authorization": f"Bearer {client_token}",
        "User-Token": f"Bearer {user_token}"
    }
    response = requests.post(sales_url, json=payload, headers=headers)
    try:
        return response.json(), response.status_code
    except requests.exceptions.JSONDecodeError:
        return {"message": "Invalid response from sales service"}, 500

def list_cart():
    sales_url = f"{current_app.config.get('SALES_SERVICE_URL')}/list"
    user_id = get_jwt_identity()

    client_token = TokenService.generate_client_token()
    user_token = request.headers.get("Authorization").replace("Bearer ", "")

    headers = {
        "Authorization": f"Bearer {client_token}",
        "User-Token": f"Bearer {user_token}"
    }

    response = requests.get(f"{sales_url}/{user_id}", headers=headers)

    if response.status_code == 200:
        return response.json(), 200
    return {"mensagem": "Erro ao listar o carrinho."}, response.status_code

def update_cart(data):
    """
    Atualiza a quantidade de um item no carrinho.
    """
    sales_url = f"{current_app.config.get('SALES_SERVICE_URL')}"
    user_id = get_jwt_identity()
    
    payload = {
        "user_id": user_id,
        "book_id": data.get("book_id"),
        "action": data.get("action")
    }
    
    client_token = TokenService.generate_client_token()
    user_token = request.headers.get("Authorization").replace("Bearer ", "")

    headers = {
        "Authorization": f"Bearer {client_token}",
        "User-Token": f"Bearer {user_token}"
    }
    
    response = requests.put(sales_url, json=payload, headers=headers)
    try:
        return response.json(), response.status_code
    except requests.exceptions.JSONDecodeError:
        return {"message": "Invalid response from sales service"}, 500
    
def delete_cart(book_id):
    """
    Remove um item do carrinho do usuário autenticado.
    """
    sales_url = f"{current_app.config.get('SALES_SERVICE_URL')}"
    user_id = get_jwt_identity()
    
    payload = {"user_id": user_id, "book_id": book_id}
    
    client_token = TokenService.generate_client_token()
    user_token = request.headers.get("Authorization").replace("Bearer ", "")

    headers = {
        "Authorization": f"Bearer {client_token}",
        "User-Token": f"Bearer {user_token}"
    }
    
    response = requests.delete(sales_url, json=payload, headers=headers)
    try:
        return response.json(), response.status_code
    except requests.exceptions.JSONDecodeError:
        return {"message": "Invalid response from sales service"}, 500
    
def clear_cart():
    """
    Exclui todos os itens do carrinho de um usuário.
    """
    sales_url = f"{current_app.config.get('SALES_SERVICE_URL')}/clear"
    user_id = get_jwt_identity()
    
    client_token = TokenService.generate_client_token()
    user_token = request.headers.get("Authorization").replace("Bearer ", "")

    headers = {
        "Authorization": f"Bearer {client_token}",
        "User-Token": f"Bearer {user_token}"
    }
    
    response = requests.delete(f"{sales_url}/{user_id}", headers=headers)
    
    try:
        return response.json(), response.status_code
    except requests.exceptions.JSONDecodeError:
        return {"message": "Invalid response from sales service"}, 500
