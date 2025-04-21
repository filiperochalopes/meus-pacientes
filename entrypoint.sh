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

echo "🚀 Iniciando Uvicorn..."
exec uvicorn asgi:asgi_app \
  --host 0.0.0.0 \
  --port 5000 \
  --reload \
  --log-level debug \
  --access-log \
  --use-colors \
  --log-config ../uvicorn-log-config.yaml