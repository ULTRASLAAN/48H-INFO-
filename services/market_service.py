class MarketService:
    def __init__(self):
        self.products_mock_db = []
        self.product_id_counter = 1

    def create_product(self, seller_id, title, description, price):
        new_product = {
            "id": self.product_id_counter,
            "seller_id": seller_id,
            "title": title,
            "description": description,
            "price": price
        }
        self.products_mock_db.append(new_product)
        self.product_id_counter += 1
        return new_product

    def get_all_products(self):
        return self.products_mock_db