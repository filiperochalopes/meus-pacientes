cd api
pip install --upgrade pip
pip install --user -r .devcontainer/requirements.txt
pip install gunicorn
mkdir /var/log/api
gunicorn -w 1 -b 0.0.0.0:5000 app:app --access-logfile /var/log/api/gunicorn-access.log --error-logfile /var/log/api/gunicorn-error.log --log-level debug --name=api --capture-output --reload --daemon
echo 'alias apilog="tail -f /var/log/api/gunicorn-error.log"' >> ~/.bashrc
echo 'FLASK_APP=/workspaces/e-SUS-PEC-meus-pacientes/api/app/__init__.py >> ~/.bashrc'
echo 'alias apirun="cd /workspaces/e-SUS-PEC-meus-pacientes/api && gunicorn -w 1 -b 0.0.0.0:5000 app:app --access-logfile /var/log/api/gunicorn-access.log --error-logfile /var/log/api/gunicorn-error.log --log-level debug --name=api --capture-output --reload --daemon"' >> ~/.bashrc
flask db upgrade
cd ..
cp .devcontainer/nginx.conf /etc/nginx/sites-available/default
service nginx start
cd web
yarn
yarn start