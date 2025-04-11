from flask import request
from flask_jwt_extended import jwt_required
from flask_restx import Namespace, Resource, fields, reqparse
from services.authService import login_user, register_user, delete_user
from services.salesService import add_to_cart, list_cart, update_cart, delete_cart, clear_cart
from services.books import get_book_info, listar_livros_por_categoria

api = Namespace('livros', description='Operações relacionadas a livros')

usuario_namespace = Namespace('usuarios', description='Operações relacionadas a usuários.')
cart_namespace = Namespace('cart', description='Operações relacionados a vendas.')
livros_namespace = Namespace('livros', description='Operações relacionadas a livros.')

parser = reqparse.RequestParser()
parser.add_argument('categoria', type=str, required=True, help="Categoria dos livros")
parser.add_argument('pagina', type=int, required=False, default=1, help="Número da página")

login_usuario_modelo = usuario_namespace.model('Login de usuario', {
    'email': fields.String(description='Email do usuário', required=True, example='rodrigo@gmail.com'),
    'senha': fields.String(description='Senha do usuário', required=True, example='rodrigo123'),
})

cadastro_usuario_modelo = usuario_namespace.model('Cadastro Usuario', {
    'nome': fields.String(required=True, description='Nome completo do usuário', example='Rodrigo'),
    'email': fields.String(required=True, description='Email do usuário', example='rodrigo@gmail.com'),
    'senha': fields.String(required=True, description='Senha do usuário', example='rodrigo123'),
})

usuario_modelo = usuario_namespace.model('Usuario', {
    'id': fields.Integer(description='ID do usuário', example=1),
    'nome': fields.String(description='Nome do usuário', required=True, example='João Silva'),
    'email': fields.String(description='Email do usuário', required=True, example='joao@email.com'),
    'role': fields.String(description='Role do usuário', required=True, example='admin'),
})

livro_modelo = livros_namespace.model('Livro', {
    'id': fields.String(description='ID do livro', required=True, example='1k1eqh_M8I4C'),
    'title': fields.String(description='Título do livro', required=True, example='O Poder do Hábito'),
    'authors': fields.String(description='Autores do livro', required=True, example='[Morgan Ramsay, Riemer Grootjans]'),
    'thumbnail': fields.String(description='Imagem do livro', required=True, example='https://example.com/thumbnail.jpg'),
    'price': fields.Float(description='Preço do livro', required=True, example=29.90),
    'currency': fields.String(description='Moeda', required=True, example='BRL'),
    "country": fields.String(description='País', required=True, example="BR")
})

cart_add_livro = cart_namespace.model('Adicionar ao Carrinho', {
    'book_id': fields.String('ID do livro', required=True, example='1k1eqh_M8I4C'),
    'title': fields.String(description='Título do livro', required=True, example='O Poder do Hábito'),
    'price': fields.Float(description='Preço do livro', required=True, example=207.90),
    'quantity': fields.Integer(description='Quantidade de livros', required=True, example=1)
})

cart_update_livro = cart_namespace.model('Atualizar o Carrinho', {
    'book_id': fields.String('ID do livro', required=True, example='1k1eqh_M8I4C'),
    'action': fields.String(description='Acão desejada increment/decrement', required=True, example='increment'),
})

cart_delete_item = cart_namespace.model('Deletar do Carrinho', {
    'book_id': fields.String('ID do livro', required=True, example='1k1eqh_M8I4C'),
})


# ** Roteamento de Autenticação (Auth) **
@usuario_namespace.route('/auth')
class AutenticacaoResource(Resource):
    @usuario_namespace.expect(login_usuario_modelo)
    def post(self):
        """
        Endpoint para autenticação do usuário. O usuário fornece seu email e senha,
        que são validados para verificar as credenciais.
        Se as credenciais forem válidas, um token de acesso é gerado e retornado.
        """
        data = request.get_json()
        token, error, status = login_user(data)
        if error:
            return {"mensagem": error}, status
        return {"access_token": token}, 200


# ** Roteamento de Usuario **
@usuario_namespace.route('/cadastrar', methods=["POST"])
class CadastrarUsuario(Resource):
    @usuario_namespace.expect(cadastro_usuario_modelo)
    def post(self): 
        """
        Endpoint para cadastrar um novo usuário. O usuário precisa fornecer
        o nome, email e senha. O email será validado para garantir que não 
        seja repetido e a senha será verificada para garantir que tenha no mínimo 
        8 caracteres.
        """
        data = request.get_json()
        mensagem, status = register_user(data)
        return {"mensagem": mensagem}, status

@usuario_namespace.route('/<int:usuario_id>', methods=["DELETE"])
class DeletarUsuario(Resource):
    @usuario_namespace.doc(security='Bearer Auth')
    @jwt_required()
    def delete(self, usuario_id):
        """
        Endpoint para deletar um usuário.
        """
        mensagem, status = delete_user(usuario_id)
        return {"mensagem": mensagem}, status

# Adicionar item ao carrinho
@cart_namespace.route('/add')
class AdicionarAoCarrinho(Resource):
    @cart_namespace.expect(cart_add_livro)
    @jwt_required()
    def post(self):
        """ Adiciona um item ao carrinho. """
        data = request.get_json()
        return add_to_cart(data)
    
# Atualizar item do carrinho
@cart_namespace.route('/update')
class AtualizarCarrinho(Resource):
    @cart_namespace.expect(cart_update_livro)
    @jwt_required()
    def put(self):
        """ Atualiza um item do carrinho. """
        data = request.get_json()
        return update_cart(data)
    
# Listar itens do carrinho
@cart_namespace.route('/list')
class ListarCarrinho(Resource):
    @jwt_required()
    def get(self):
        """
        Lista os itens no carrinho do usuário autenticado.
        """
        return list_cart()

# Remover item do carrinho
@cart_namespace.route('/remove/<string:book_id>')
class RemoverDoCarrinho(Resource):
    @cart_namespace.expect(cart_delete_item)
    @jwt_required()
    def delete(self, book_id):
        """ Remove um item do carrinho. """
        return delete_cart(book_id)
    
# Limpar o carrinho
@cart_namespace.route('/clear')
class LimparCarrinho(Resource):
    @jwt_required()
    def delete(self):
        """ Limpa o carrinho. """
        return clear_cart()

@livros_namespace.route('/<string:book_id>')
class BuscarLivro(Resource):
    @livros_namespace.doc('Buscar livro no Google Books')
    @livros_namespace.marshal_with(livro_modelo)
    def get(self, book_id):
        """
        Endpoint para buscar um livro pelo ID no Google Books e retornar as informações detalhadas.
        """
        book_info = get_book_info(book_id)

        if "error" in book_info:
            return {"mensagem": "Livro não encontrado"}, 404

        return book_info, 200

@livros_namespace.route('/categoria')
class ListarLivrosPorCategoria(Resource):
    @livros_namespace.doc('Listar livros por categoria com paginação')
    @livros_namespace.expect(parser)
    @livros_namespace.marshal_with(livro_modelo, envelope='livros') 
    def get(self):
        """
        Endpoint para listar livros por categoria de forma paginada da Google Books API.
        """
        args = parser.parse_args()
        categoria = args.get('categoria', '').strip()
        pagina = args.get('pagina', '1')

        try:
            pagina = int(pagina)
            if pagina < 1:
                pagina = 1 
        except ValueError:
            return {"error": "O número da página deve ser um inteiro válido"}, 400

        livros = listar_livros_por_categoria(categoria, pagina)

        if "error" in livros:
            return {"mensagem": "Erro ao buscar os livros"}, 500

        return livros, 200