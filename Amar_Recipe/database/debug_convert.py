
import re

input_file = 'c:/xampp/htdocs/Amar_Recipies_Live/Amar_Recipe/database/amar_recipe.sql'

def debug_file():
    target_tables = {
        'recipes', 
        'submission_requests', 
        'admin_requests', 
        'ratings', 
        'admin_chat_messages',
        'reports'
    }
    
    with open(input_file, 'r', encoding='utf-8', errors='replace') as infile:
        count = 0
        insert_count = 0
        for line in infile:
            count += 1
            if count > 2000: # checking first 2000 lines
                break
            
            line_stripped = line.strip()
            if not line_stripped.lower().startswith("insert into"):
                continue
                
            insert_count += 1
            print(f"Line {count}: Found INSERT")
            
            # Check table regex
            match = re.search(r"INSERT INTO `?(\w+)`?", line_stripped, re.IGNORECASE)
            if match:
                table = match.group(1)
                print(f"  Matched table: '{table}'")
                if table in target_tables:
                    print(f"  Table '{table}' is in target_tables.")
                    
                    # Check VALUES split
                    if "VALUES " in line_stripped:
                        print("  'VALUES ' found.")
                    elif "values " in line_stripped:
                        print("  'values ' (lowercase) found.")
                    else:
                        print("  'VALUES' keyword NOT found (or check casing).")
                else:
                    print(f"  Table '{table}' IS NOT in target_tables.")
            else:
                print("  Regex failed to extract table name.")
                print(f"  Line content: {line_stripped[:100]}...")

debug_file()
