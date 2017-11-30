from pymongo import MongoClient

conn = MongoClient()
db = conn.code.config
for i in range(4):
    db.insert({"id": str(i+1), "price": "1000", "product": "jyk", "account": "1000113100001791937"})