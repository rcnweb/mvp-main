from flask_restx import Namespace, Resource, fields
from services.cartService import add_to_cart, remove_from_cart, update_cart_quantity, list_cart, delete_user_cart

api = Namespace('Cart', description='Operações relacionadas a venda de livros')

cart_namespace = Namespace('cart', description='Gerenciamento do carrinho')

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
    
# Rotas do Carrinho
@cart_namespace.route('/')
class CartResource(Resource):
    def post(self):
        """Adiciona um item ao carrinho."""
        return add_to_cart()

    def put(self):
        """Atualiza a quantidade de um item no carrinho."""
        return update_cart_quantity()

    def delete(self):
        """Remove um item do carrinho."""
        return remove_from_cart()
    
@cart_namespace.route('/clear/<int:user_id>')
class ClearCartResource(Resource):
    def delete(self, user_id):
        """Remove todos os itens do carrinho de um usuário."""
        return delete_user_cart(user_id)

@cart_namespace.route('/list/<int:user_id>')
class ListarCarrinho(Resource):
    def get(self, user_id):
        """Lista os itens do carrinho de um usuário."""
        return list_cart(user_id)