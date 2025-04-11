from flask import request, jsonify
from config import Config
from services.tokenService import verify_user_token, verify_client_token
import logging

logger = logging.getLogger(__name__)

def authenticate_request():
    """Autentica a requisição verificando os tokens do usuário e do cliente."""
    user_token = request.headers.get('User-Token', '').replace("Bearer ", "")
    client_token = request.headers.get('Authorization', '').replace("Bearer ", "")

    user_id = verify_user_token(user_token)
    if not user_id:
        logger.warning("Acesso negado: Token de usuário inválido.")
        return {"message": "Usuário não autenticado"}, 401

    if not verify_client_token(client_token):
        logger.warning("Acesso negado: Token de cliente inválido.")
        return {"message": "Invalid client token"}, 403

    return user_id
