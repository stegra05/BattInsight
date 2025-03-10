import requests
import json

def test_endpoint(url, method="GET", data=None):
    print(f"Testing {method} {url}")
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        
        print(f"Status Code: {response.status_code}")
        try:
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    print("-" * 50)

# Test healthcheck endpoint
test_endpoint("http://localhost:5000/healthcheck")

# Test data endpoint
test_endpoint("http://localhost:5000/api/data")

# Test filter endpoints
test_endpoint("http://localhost:5000/api/filter")
test_endpoint("http://localhost:5000/api/filter/options")
test_endpoint("http://localhost:5000/api/filter/countries")
test_endpoint("http://localhost:5000/api/filter/continents")

# Test AI query endpoint
test_endpoint("http://localhost:5000/api/ai-query", method="POST", data={"query": "Show all data for Europe with temperate climate"}) 