from flask import Flask, request, render_template, redirect, make_response
from db import init_db, get_connection

app = Flask(__name__)

# Segredo hardcoded e fraco (vulnerabilidade de config)
app.config["SECRET_KEY"] = "segredo-muito-bosta-123"

# Inicializa o banco na primeira execução
init_db()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """
    Vulnerabilidades:
    - SQL Injection no login
    - Cookie inseguro (sem HttpOnly, sem Secure)
    """
    error = None
    if request.method == "POST":
        username = request.form.get("username", "")
        password = request.form.get("password", "")

        # VULN: SQL injection usando string concatenada
        conn = get_connection()
        cur = conn.cursor()
        query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
        print("Executando query insegura:", query)
        cur.execute(query)
        user = cur.fetchone()
        conn.close()

        if user:
            resp = make_response(redirect("/profile?id=" + str(user["id"])))
            # VULN: cookie sem HttpOnly, sem Secure, sem SameSite
            resp.set_cookie("session_user", user["username"])
            return resp
        else:
            error = "Usuário ou senha inválidos (ou você errou no SQL injection, né?)."

    return render_template("login.html", error=error)


@app.route("/search")
def search():
    """
    Vulnerabilidades:
    - XSS refletido com parâmetro 'q'
    - SQL injection em busca por nome
    """
    q = request.args.get("q", "")

    results = []
    if q:
        conn = get_connection()
        cur = conn.cursor()
        # VULN: SQL injection novamente
        query = f"SELECT id, username, role FROM users WHERE username LIKE '%{q}%'"
        print("Executando busca insegura:", query)
        try:
            cur.execute(query)
            results = cur.fetchall()
        except Exception as e:
            results = []
            print("Erro na busca:", e)
        conn.close()

    # XSS: o próprio template usa o termo de forma não escapada
    return render_template("search.html", q=q, results=results)


@app.route("/profile")
def profile():
    """
    Vulnerabilidades:
    - SQL injection via parâmetro 'id'
    - Falta de controle de acesso (sem autenticação de verdade)
    """
    user_id = request.args.get("id", "1")

    conn = get_connection()
    cur = conn.cursor()
    query = f"SELECT id, username, role FROM users WHERE id = {user_id}"
    print("Executando profile inseguro:", query)
    cur.execute(query)
    user = cur.fetchone()
    conn.close()

    if not user:
        return "Usuário não encontrado", 404

    return render_template("profile.html", user=user)


@app.route("/debug")
def debug():
    """
    Vulnerabilidades:
    - Informação sensível exposta
    - Versão, config, env etc
    """
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, username, password, role FROM users")
    users = cur.fetchall()
    conn.close()

    return render_template("debug.html", users=users, config=app.config)


@app.route("/insecure-header")
def insecure_header():
    """
    VULN:
    - Sem headers de segurança (X-Frame-Options, CSP, etc.)
    - ZAP deve reclamar disso também.
    """
    return "<h1>Página sem headers de segurança</h1>"


if __name__ == "__main__":
    # Importante pro pipeline: host 0.0.0.0, porta 5000
    app.run(host="0.0.0.0", port=5000, debug=True)
