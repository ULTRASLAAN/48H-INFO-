class GroupService:
    def __init__(self):
        self.groups_mock_db = []
        self.group_id_counter = 1

    def create_group(self, creator_id, name, description):
        new_group = {
            "id": self.group_id_counter,
            "creator_id": creator_id,
            "name": name,
            "description": description,
            "members": [creator_id]
        }
        self.groups_mock_db.append(new_group)
        self.group_id_counter += 1
        return new_group

    def get_all_groups(self):
        return self.groups_mock_db