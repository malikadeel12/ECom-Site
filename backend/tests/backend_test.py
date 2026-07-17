"""VARA backend API tests"""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://studio-select-1.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

REQUIRED_FIELDS = {"slug", "name", "category", "collection", "price", "images", "rating", "reviews", "affiliate_url", "badge", "featured", "bestseller"}
EXPECTED_SLUGS = {
    "meridian-chronograph", "solenne-automatic", "eclipse-noir", "obsidian-frame",
    "riva-sun", "aurel-cat-eye", "marlow-tote", "noir-carryall", "sable-sling",
    "ledger-bifold", "slim-cardholder", "ora-hoops", "cascade-chain",
    "meridian-band", "voyage-tech-folio", "second-skin-sleeve"
}


class TestProducts:
    def test_list_products_returns_16(self):
        r = requests.get(f"{API}/products", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 16
        for p in data:
            missing = REQUIRED_FIELDS - set(p.keys())
            assert not missing, f"Missing fields: {missing}"
        slugs = {p["slug"] for p in data}
        assert slugs == EXPECTED_SLUGS

    def test_filter_by_category(self):
        r = requests.get(f"{API}/products?category=Watches", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        assert all(p["category"] == "Watches" for p in data)

    def test_filter_featured(self):
        r = requests.get(f"{API}/products?featured=true", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        assert all(p["featured"] for p in data)

    def test_filter_bestseller(self):
        r = requests.get(f"{API}/products?bestseller=true", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        assert all(p["bestseller"] for p in data)

    def test_get_product_by_slug(self):
        r = requests.get(f"{API}/products/meridian-chronograph", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["slug"] == "meridian-chronograph"
        assert data["name"] == "Meridian Chronograph"

    def test_get_unknown_slug_404(self):
        r = requests.get(f"{API}/products/does-not-exist", timeout=15)
        assert r.status_code == 404

    def test_related_products(self):
        r = requests.get(f"{API}/products/meridian-chronograph/related", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 4
        assert all(p["slug"] != "meridian-chronograph" for p in data)


class TestCategories:
    def test_categories(self):
        r = requests.get(f"{API}/categories", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 6
        assert set(data) == {"Watches", "Eyewear", "Bags", "Wallets", "Jewelry", "Tech"}


class TestNewsletter:
    def test_subscribe(self):
        r = requests.post(f"{API}/newsletter", json={"email": "TEST_nl@example.com"}, timeout=15)
        assert r.status_code == 200
        assert r.json()["status"] == "subscribed"

    def test_subscribe_idempotent(self):
        requests.post(f"{API}/newsletter", json={"email": "TEST_dup@example.com"}, timeout=15)
        r = requests.post(f"{API}/newsletter", json={"email": "TEST_dup@example.com"}, timeout=15)
        assert r.status_code == 200
        assert r.json()["status"] == "subscribed"


class TestContact:
    def test_contact_submit(self):
        r = requests.post(f"{API}/contact", json={
            "name": "TEST User", "email": "TEST_c@example.com",
            "subject": "General", "message": "Hello"
        }, timeout=15)
        assert r.status_code == 200
        assert r.json()["status"] == "received"
