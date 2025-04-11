import requests
from config import Config

def listar_livros_por_categoria(categoria, pagina=1, max_results=5):
    """
    Obtém uma lista paginada de livros por categoria usando o Google Books API, garantindo que apenas livros com preços sejam retornados.
    """
    try:
        if not str(pagina).isdigit():  
            pagina = 1 
        
        pagina = int(pagina) 
        start_index = (pagina - 1) * (max_results * 4)
        
        url = f"https://www.googleapis.com/books/v1/volumes?q=subject:{categoria}&startIndex={start_index}&maxResults={max_results * 4}&key={Config.GOOGLE_API_KEY}&country=BR"
        response = requests.get(url)

        if response.status_code != 200:
            print(f"Erro na requisição: {response.status_code} - {response.text}")
            return {'error': f"Falha ao buscar a lista de livros. Status Code: {response.status_code}"}

        data = response.json()

        books = data.get("items", [])
        if not books:
            return {'error': 'Nenhum livro encontrado para essa categoria.'}

        livros_formatados = []
        for book in books:
            volume_info = book.get("volumeInfo", {})
            sale_info = book.get("saleInfo", {})

            if sale_info.get("saleability") == "FOR_SALE":
                retail_price = sale_info.get("retailPrice", {})
                preco = retail_price.get("amount")
                moeda = retail_price.get("currencyCode")
                pais = sale_info.get("country", "Desconhecido")

                authors = volume_info.get("authors", ["Autor desconhecido"])
                if isinstance(authors, str):
                    authors = [authors]

                livro = {
                    "id": book.get("id", "ID desconhecido"),
                    "title": volume_info.get("title", "Título desconhecido"),
                    "authors": ", ".join(authors),
                    "thumbnail": volume_info.get("imageLinks", {}).get("thumbnail"),
                    "price": preco,
                    "currency": moeda,
                    "country": pais
                }
                livros_formatados.append(livro)

                if len(livros_formatados) == max_results:
                    break 

        return livros_formatados

    except Exception as e:
        print(f"Erro ao processar a requisição: {str(e)}") 
        return {'error': f'Erro interno: {str(e)}'}

def get_book_info(book_id):
    """
    Obtém informações detalhadas de um livro específico usando o Google Books API,
    garantindo que contenha as mesmas informações retornadas na busca por categoria.
    """
    try:
        url = f"https://www.googleapis.com/books/v1/volumes/{book_id}?key={Config.GOOGLE_API_KEY}"
        response = requests.get(url)

        if response.status_code != 200:
            return {'error': 'Falha ao buscar dados do livro'}

        data = response.json()
        volume_info = data.get("volumeInfo", {})
        sale_info = data.get("saleInfo", {})

        preco = None
        moeda = None
        pais = sale_info.get("country", "Desconhecido")

        if sale_info.get("saleability") == "FOR_SALE":
            retail_price = sale_info.get("retailPrice", {})
            preco = retail_price.get("amount")
            moeda = retail_price.get("currencyCode")

        return {
            "id": data.get("id", "ID desconhecido"),
            "title": volume_info.get("title", "Título desconhecido"),
            "authors": volume_info.get("authors", ["Autor desconhecido"]),
            "thumbnail": volume_info.get("imageLinks", {}).get("thumbnail"),
            "price": preco,
            "currency": moeda,
            "country": pais
        }

    except Exception as e:
        return {'error': str(e)}