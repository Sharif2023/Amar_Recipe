@echo off
curl -X POST https://amar-recipe-backend.onrender.com/src/api/submit_recipe_request.php -d "title=Test Recipe&category=Meat&description=Test Description&location=Dhaka&organizerName=Test User&organizerEmail=test@example.com&organizerAddress=Dhaka"
