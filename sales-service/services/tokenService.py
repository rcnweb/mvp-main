import jwt
from config import Config
from flask_jwt_extended import decode_token

def verify_client_token(token):
    """Valida o token de cliente."""
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
        return payload.get("client", False)
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False
    
def verify_user_token(user_token):
    """Valida o token de um usuário e verifica se ele possui a role CLIENTE."""
    try:
        decoded_token = decode_token(user_token)
        
        user_id = decoded_token.get('sub', None)
        role = decoded_token.get('role', None) 
        
        if user_id is None or role != 'CLIENTE':  
            return None
        
        return user_id
        
    except jwt.InvalidTokenError:
        return None
