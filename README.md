<div align='center'>
  <h1>
    Projeto do MVP
  </h1>
</div>

Olá pessoal, este é o meu projeto para o MVP. Bom ele consiste em ser uma loja de livros online com o propósito de ser uma busca alternativa para pessoas que buscam livros online.

# Como rodar a aplicação?

Cada projeto tem sua pasta separada e cada uma com seus respectivos dockerfile's. Para facilitar a nossa instalação tomei a liberdade de colocar o arquivo do docker compose na pasta raiz onde se encontra os projetos 
separados. O docker compose está configurando cada container de forma individual como é requisitado no projeto, agora vamos para os comandos de instalação.

- 1° Clone o repositório e navegue até a pasta em que se encontra os projetos.
- 2° Com o CMD aberto digite o comando:
```
$ docker-compose up --build
```
# Como rodar cada aplicação de forma separada?
Será necessário que tenha uma aba aberta no CMD na pasta raiz para cada projeto.
- Para a API Principal:
```
$ docker-compose build api-principal
$ docker-compose up api-principal
```
- Para o Micro Serviço:
```
$ docker-compose build sales-service
$ docker-compose up sales-service
```
- Para o Front-End:
```
$ docker-compose build frontend
$ docker-compose up frontend
```

# Acessando a aplicação
Com todos os projetos rodando agora você pode acessar:
- API Principal: [Swagger](http://localhost:5000/swagger)
- Front-End: [Front-End](http://localhost:80)

# Fluxograma da aplicação 

(Aqui você insere a imagem do Fluxograma)


# API externa (Google Books API)

A aplicação principal já está configurada com a minha KEY para que vocês possam realizar a avalição, porém ela tem um cota diária mas acredito que consigam testar sem quaisquer problemas.
Caso queiram configurar a própria key de vocês, o serviço é gratuito basta se registrar na Google Cloud Console, ativar a API para a conta de vocês e obter a chave de acesso.

- Google Books API:
  [Documentação](https://developers.google.com/books/docs/v1/using?hl=pt-br)






