cd api
# python asgi.py

uvicorn asgi:asgi_app \
  --host 0.0.0.0 \
  --port 5000 \
  --reload \
  --log-level debug \
  --access-log \
  --use-colors \
  --log-config ../uvicorn-log-config.yaml