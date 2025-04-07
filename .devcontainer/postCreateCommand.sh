pip install --upgrade pip
pip install -r requirements.txt

mkdir -p /var/log/api

echo 'alias apilog="tail -f /var/log/api/gunicorn-error.log"' >> ~/.bashrc

prisma generate --schema api/schema.prisma
prisma db push --schema api/schema.prisma