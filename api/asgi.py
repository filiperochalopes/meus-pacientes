from app import app

asgi_app = app

if __name__ == "__main__":
    app.run(use_reloader=True, debug=True, threaded=True)
