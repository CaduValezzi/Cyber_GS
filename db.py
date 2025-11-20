import sqlite3
import os

DB_NAME = "app.db"


def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    # Se já existe, não recria
    if os.path.exists(DB_NAME):
        return

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        );
    """)

    # Usuários com senha em texto puro, óbvio que péssimo
    cur.execute("INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin');")
    cur.execute("INSERT INTO users (username, password, role) VALUES ('alice', 'senha123', 'user');")
    cur.execute("INSERT INTO users (username, password, role) VALUES ('bob', '123456', 'user');")

    conn.commit()
    conn.close()
