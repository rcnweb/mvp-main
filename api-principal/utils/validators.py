import re
from email_validator import validate_email, EmailNotValidError

def email_valido(email):
    """Valida o formato do email usando expressão regular."""
    padrao = r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$'
    return re.match(padrao, email) is not None

def email_valido_completo(email):
    """Valida o email com a biblioteca email-validator."""
    try:
        validate_email(email)
        return True
    except EmailNotValidError:
        return False

def senha_valida(senha):
    """Verifica se a senha possui 8 ou mais caracteres."""
    return len(senha) >= 8

def sinopse_valida(sinopse):
    """Valida se a sinopse possui a quantidade minima de caracteres."""
    sinopse_sem_espacos = sinopse.replace(" ", "")
    return len(sinopse_sem_espacos) >= 10
