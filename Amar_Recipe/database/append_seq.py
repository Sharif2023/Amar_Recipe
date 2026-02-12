
import os

file_path = 'c:/xampp/htdocs/Amar_Recipies_Live/Amar_Recipe/database/data_postgres.sql'

commands = [
    "\n-- Reset sequences after import\n",
    "SELECT setval('recipes_id_seq', COALESCE((SELECT MAX(id) FROM recipes), 1));\n",
    "SELECT setval('recipe_submission_requests_id_seq', COALESCE((SELECT MAX(id) FROM recipe_submission_requests), 1));\n",
    "SELECT setval('admin_requests_id_seq', COALESCE((SELECT MAX(id) FROM admin_requests), 1));\n",
    "SELECT setval('reports_id_seq', COALESCE((SELECT MAX(id) FROM reports), 1));\n",
    "SELECT setval('ratings_id_seq', COALESCE((SELECT MAX(id) FROM ratings), 1));\n",
    "SELECT setval('admin_chat_messages_id_seq', COALESCE((SELECT MAX(id) FROM admin_chat_messages), 1));\n"
]

with open(file_path, 'a', encoding='utf-8') as f:
    f.writelines(commands)

print("Appended sequence reset commands.")
