build:
	docker compose build --no-cache
run:
	docker compose up --build
logs:
	docker compose logs -f
seed:
	docker compose exec -it app bash -c "FLASK_APP=app/__init__.py && \
	flask seed"
bash:
	docker compose exec -it app bash
flask_shell:
	docker compose exec -it app bash -c "flask shell"
migrate:
	docker compose exec -it app bash -c ' \
		chmod -R 777 /app/migrations && \
		flask db upgrade'
makemigrations:
	docker compose exec -it app bash -c ' \
		chmod -R 777 /app/migrations && \
		flask db migrate -m "$(m)"'
test_all:
	docker exec -it evolucao_hospitalar_app bash -c 'pytest -s'
clean_db:
	docker compose rm -s -v -f db
	sudo rm -rf data
	docker compose up -d db
	sleep 10
	docker exec -it evolucao_hospitalar_app bash -c ' \
		flask db upgrade'
test_flow:
	# Clean all database
	docker exec -it evolucao_hospitalar_db bash -c 'psql -U postgres -c "\set AUTOCOMMIT on" -c "DROP DATABASE hmlem WITH (FORCE)" -c "CREATE DATABASE hmlem"'
	docker exec -it evolucao_hospitalar_app bash -c 'flask db upgrade && flask seed'
	docker exec -it evolucao_hospitalar_app bash -c 'pytest -s -k TestInternmentFlow'
	docker exec -it evolucao_hospitalar_app bash -c 'pytest -s -k TestPrintPdfs'
fix-folder-permission:
	docker exec -it evolucao_hospitalar_app bash -c ' \
		chmod -R 777 /app/migrations'