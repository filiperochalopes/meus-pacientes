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

# Comando para iniciar a aplicação usando Gunicorn
CMD ["gunicorn", "wsgi:app", "--bind", "0.0.0.0:5000", "--workers", "2"]