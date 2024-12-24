# Controle de Ponto API

Esta API permite registrar e visualizar os turnos de trabalho dos colaboradores, incluindo funcionalidades para iniciar e finalizar turnos, além de consultar as horas trabalhadas no dia atual e em dias anteriores.

## Como rodar o Docker

### 1. **Certifique-se de ter o Docker e Docker Compose instalados**:
   - Se você ainda não tem o Docker instalado, pode seguir as instruções [aqui](https://docs.docker.com/get-docker/) para instalá-lo.
   - Para instalar o Docker Compose, siga as instruções [aqui](https://docs.docker.com/compose/install/).

### 2. **Construir as imagens Docker**:
   - No diretório raiz do projeto, execute o seguinte comando para construir a imagem Docker:
     ```bash
     docker-compose build
     ```
   - Esse comando irá construir todas as imagens necessárias conforme o arquivo `docker-compose.yml`.

### 3. **Rodar os containers Docker**:
   - Após a construção das imagens, rode os containers com o seguinte comando:
     ```bash
     docker-compose up
     ```
   - A aplicação estará disponível em `http://localhost:3000`.

### 4. **Rodar os containers em segundo plano**:
   - Para rodar os containers em segundo plano (detached mode), use a opção `-d`:
     ```bash
     docker-compose up -d
     ```

## Acessando o Swagger

1. **Abrir o Swagger UI**:
   - Após rodar o Docker, acesse o Swagger UI através do seguinte endereço no seu navegador:
     ```bash
     http://localhost:3000/api
     ```
   - O Swagger irá exibir a documentação interativa da API, onde você pode testar as rotas.

## Observação: Validação de CPF

O CPF é validado utilizando o algoritmo oficial de verificação, que envolve dois passos principais:

1. **Verificação dos dígitos verificadores**: O CPF contém 9 números seguidos de dois dígitos verificadores, que são calculados com base nos 9 primeiros números. Se os dígitos calculados não coincidirem com os fornecidos, o CPF é considerado inválido.
   
2. **Verificação de CPF repetido**: Além da validação dos dígitos, o CPF também não pode ser composto por sequências repetidas como "111.111.111-11" ou "123.123.123-12", que são inválidas por não seguirem um padrão único de distribuição.

Se o CPF informado na rota for inválido ou já estiver cadastrado, a operação será bloqueada e uma resposta de erro será retornada.

## Como rodar os testes

### 1. **Certifique-se de ter o Node.js e o npm instalados**:
   - Para instalar o Node.js e npm, siga as instruções [aqui](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

### 2. **Instalar as dependências do projeto**:
   - No diretório raiz do projeto, execute o seguinte comando para instalar as dependências:
     ```bash
     npm install
     ```

### 3. **Rodar os testes**:
   - Para rodar os testes, utilize o comando:
     ```bash
     npm test
     ```

### 4. **Rodar os testes em modo de desenvolvimento**:
   - Para rodar os testes em modo de desenvolvimento (com atualizações automáticas), use o comando:
     ```bash
     npm run test:dev
     ```