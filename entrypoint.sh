#!/bin/sh

# Garante que a variável DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL não está definida. Abortando..."
  exit 1
fi

echo "✅ DATABASE_URL detectada: $DATABASE_URL"

echo "📦 Executando: prisma generate"
prisma generate

echo "🛠️ Executando: prisma db push"
prisma db push

echo "🚀 Iniciando Gunicorn com reload..."
exec gunicorn wsgi:app \
  --bind 0.0.0.0:5000 \
  --workers 2 \
  --threads 4 \
  --reload \
  --log-level debug \
  --access-logfile - \
  --error-logfile -