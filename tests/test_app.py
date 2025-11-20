from app import app


def test_index_route():
    client = app.test_client()
    response = client.get("/")
    assert response.status_code == 200
    data = response.get_json()
    assert "status" in data
    assert data["status"] == "ok"


def test_health_route():
    client = app.test_client()
    response = client.get("/health")
    assert response.status_code == 200
