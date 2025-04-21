from flask_openapi3 import OpenAPI, Info

api_key_scheme = {"type": "apiKey", "name": "api_key", "in": "header"}
security_schemes = {"api_key": api_key_scheme}

info = Info(title="Patient and Appointment API", version="1.0.0")

app = OpenAPI(__name__, info=info, security_schemes=security_schemes)


@app.get("/")
async def hello():
    """
    Simple hello world endpoint to check if the API is running.

    Returns:
        dict: A simple JSON object with a hello message.
    """
    return {"message": "Hello, World!"}


from app.routes.patient import patient_bp
from app.routes.appointment import appointment_bp

app.register_api(patient_bp)
app.register_api(appointment_bp)
