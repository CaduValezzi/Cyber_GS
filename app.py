from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/")
def index():
    return jsonify({
        "message": "WorkSphere API - Versão Flask de laboratório 😅",
        "status": "ok"
    })


@app.route("/health")
def health():
    return jsonify({
        "status": "healthy"
    }), 200


if __name__ == "__main__":
    # Importante: deixar host 0.0.0.0 e porta fixa pra pipeline usar
    app.run(host="0.0.0.0", port=5000)
