from app import app


def test_index_route():
    client = app.test_client()
    resp = client.get("/")
    assert resp.status_code == 200


def test_health_search_page():
    client = app.test_client()
    resp = client.get("/search")
    assert resp.status_code == 200
