FROM python:3.12-slim

# Variáveis de ambiente para evitar a criação de arquivos .pyc e permitir logs em tempo real
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Define o diretório de trabalho
WORKDIR /app

# Instala dependências do sistema necessárias, como compilador e libs para conectar ao MariaDB
RUN apt-get update && apt-get install -y build-essential libmariadb-dev

# Copia o arquivo de dependências e instala os pacotes Python
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copia todos os arquivos da aplicação para o container
COPY . .

# Expõe a porta que o Gunicorn usará
EXPOSE 5000

RUN mkdir -p /var/log/api && chmod -R 777 /var/log/api

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /app/api

# Inicia o servidor com todas as opções desejadas
CMD ["/entrypoint.sh"]