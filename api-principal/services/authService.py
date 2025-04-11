from flask_jwt_extended import create_access_token, get_jwt_identity
from models import User, db, bcrypt
from utils.validators import email_valido_completo, senha_valida

def login_user(data):
    email = data.get("email")
    senha = data.get("senha")
    usuario = User.query.filter_by(email=email).first()

    if not usuario:
        return None, "Credenciais inválidas", 401

    if not bcrypt.check_password_hash(usuario.senha, senha):
        return None, "Credenciais inválidas", 401

    access_token = create_access_token(
        identity=str(usuario.id),
        additional_claims={"role": usuario.role, "id": usuario.id}
    )
    return access_token, None, 200

def register_user(data):
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")

    if not email_valido_completo(email):
        return "Email inválido", 400

    if not senha_valida(senha):
        return "A senha deve ter 8 ou mais caracteres", 400

    if User.query.filter_by(email=email).first():
        return "Email já cadastrado", 400

    usuario = User(nome, email, senha, role="CLIENTE")
    db.session.add(usuario)
    db.session.commit()

    return "Usuário cadastrado com sucesso!", 201

def delete_user(usuario_id):

    usuario_autenticado = int(get_jwt_identity())
    if usuario_id != usuario_autenticado:
        return {"mensagem": "Você só pode deletar sua própria conta."}, 403
    usuario = User.query.get_or_404(usuario_id)  

    db.session.delete(usuario)
    db.session.commit()
    return "Usuário deletado com sucesso!", 200