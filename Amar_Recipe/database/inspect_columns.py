
import re

file_path = 'c:/xampp/htdocs/Amar_Recipies_Live/Amar_Recipe/database/amar_recipe.sql'

def get_columns(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
            
    tables = ['recipes', 'submission_requests', 'admin_requests', 'ratings', 'admin_chat_messages', 'reports']
    
    for table in tables:
        # Search for INSERT INTO `table` (...)
        pattern = re.compile(f"INSERT INTO `?{table}`?\\s*\\((.*?)\\)", re.IGNORECASE)
        match = pattern.search(content)
        if match:
            print(f"Table: {table}")
            print(f"Columns: {match.group(1)}")
            print("-" * 20)
        else:
            print(f"Table: {table} - No INSERT statement found")

get_columns(file_path)
