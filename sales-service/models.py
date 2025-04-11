from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class CartItem(db.Model):
    __tablename__ = "cart_item"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False, index=True) 
    book_id = db.Column(db.String(50), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    @property
    def total(self):
        return self.price * self.quantity
    
    def to_dict(self):
        """Converte o objeto CartItem para um dicionário"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "book_id": self.book_id,
            "title": self.title,
            "price": self.price,
            "quantity": self.quantity,
            "total": round(self.price * self.quantity, 2)
        }