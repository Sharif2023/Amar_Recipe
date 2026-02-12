
import re
import csv
import sys

# Settings
input_file = 'c:/xampp/htdocs/Amar_Recipies_Live/Amar_Recipe/database/amar_recipe.sql'
output_file = 'c:/xampp/htdocs/Amar_Recipies_Live/Amar_Recipe/database/data_postgres.sql'

# Table mappings and column adjustments
table_map = {
    'submission_requests': 'recipe_submission_requests'
}

# Columns to exclude (table -> set of columns)
exclude_cols = {
    'admin_requests': {'message'},
    'ratings': {'user_ip'}
}

# Column renames (table -> {old_col: new_col})
rename_cols = {
    'submission_requests': {
        'submission_date': 'created_at',
        'action_date': 'approved_at'
    }
}

# Tables to process
target_tables = {
    'recipes', 
    'submission_requests', 
    'admin_requests', 
    'ratings', 
    'admin_chat_messages',
    'reports'
}

def parse_mysql_values(values_str):
    """
    Parses MySQL VALUES string efficiently. 
    Handles (val1, val2), (val3, val4) ...
    Returns a list of lists.
    """
    rows = []
    current_row = []
    
    # We use csv reader to parse comma separated values, 
    # but we need to split tuples first.
    # Simple split by '),(' is risky. 
    # Let's iterate.
    
    # Actually, simpler approach: 
    # Treat the entire VALUES string as a CSV line where delimiters are ',' 
    # BUT we need to respect parentheses. 
    # The csv module doesn't handle nested structure like parens well if they aren't quotes.
    
    # Robust Custom Parser for MySQL Dump Values
    val_buffer = ""
    in_string = False
    escape = False
    quote_char = None
    stack = [] # To track parentheses
    
    # Pre-optimization: MySQL dumps usually quote strings with '
    
    # Let's try to use regex to find tuples: \((?:[^)(]|\([^)(]*\))*\)
    # This regex matches balanced parens one level deep. 
    # MySQL values are usually flat (no nested parens except in strings/functions).
    
    # Regex for a single tuple: \((.*)\) ... wait, this is hard with regex.
    
    # State machine approach
    current_token = []
    in_tuple = False
    
    # Iterate characters
    i = 0
    n = len(values_str)
    
    while i < n:
        char = values_str[i]
        
        if in_string:
            current_token.append(char)
            if escape:
                escape = False
            elif char == '\\':
                escape = True
            elif char == quote_char:
                # Potential end of string
                # Check if it's '' (escaped quote in standard SQL) or \' (mysql)
                # We are inside string, so we just tracking end.
                in_string = False
        else:
            if char == '(' and not in_tuple:
                in_tuple = True
                current_token = [] # Start of new tuple content
            elif char == ')' and in_tuple:
                # Check if this is the CLOSING paren of the tuple
                # We assume tuples aren't nested (except inside strings which we handle)
                in_tuple = False
                
                # Process the tuple text we just collected
                tuple_text = "".join(current_token)
                
                # Now parse the CSV inside the tuple
                # We use csv module here because it handles quoted strings well enough
                # provided we format it right.
                # MySQL uses ' for quoting and \ for escaping.
                # csv.reader can handle quotechar="'", escapechar='\\'
                try:
                    reader = csv.reader([tuple_text], delimiter=',', quotechar="'", escapechar='\\')
                    for r in reader:
                        rows.append(r)
                except Exception as e:
                    print(f"Error parsing tuple: {tuple_text[:50]}... : {e}")
                
            elif char == "'" or char == '"':
                in_string = True
                quote_char = char
                current_token.append(char)
            else:
                if in_tuple:
                    current_token.append(char)
        
        i += 1
        
    return rows

def process_file():
    with open(input_file, 'r', encoding='utf-8', errors='replace') as infile, \
         open(output_file, 'w', encoding='utf-8') as outfile:
        
        outfile.write("SET client_encoding = 'UTF8';\n")
        outfile.write("SET standard_conforming_strings = on;\n\n")

        buffer = ""
        current_table = None
        current_cols = []
        in_insert = False
        
        for line in infile:
            stripped = line.strip()
            
            if not in_insert:
                if stripped.lower().startswith("insert into"):
                    # Start of INSERT
                    # Check if it's a target table
                    match = re.search(r"INSERT INTO `?(\w+)`?", stripped, re.IGNORECASE)
                    if match:
                        table = match.group(1)
                        if table in target_tables:
                            current_table = table
                            in_insert = True
                            buffer = line # Keep original formatting including newlines
                            
                            # Extract columns immediately if possible, or wait?
                            # Usually columns are on the first line.
                            col_match = re.search(r"\((.*?)\)\s*VALUES", buffer, re.IGNORECASE)
                            if col_match:
                                cols_str = col_match.group(1)
                                current_cols = [c.strip().strip('`') for c in cols_str.split(',')]
                            else:
                                # Fallback: try finding columns even if VALUES is on next line? 
                                # But regex above expects VALUES.
                                # Let's handle parsing later when buffer is full?
                                # No, buffer might be huge.
                                # But wait, if VALUES is on next line, regex fails.
                                # Let's try to find columns just by (...)
                                col_match_lazy = re.search(r"INSERT INTO `?\w+`?\s*\((.*?)\)", buffer, re.IGNORECASE)
                                if col_match_lazy:
                                     cols_str = col_match_lazy.group(1)
                                     current_cols = [c.strip().strip('`') for c in cols_str.split(',')]
                                else:
                                    current_cols = [] # Should not happen if standard dump
                            
                # If not insert, ignore
            else:
                # Inside insert, append to buffer
                buffer += line
                
            # Check for end of statement (;)
            # Only if in_insert
            if in_insert:
                # Robust check: ; at end of stripped line?
                if stripped.endswith(';'):
                    in_insert = False
                    
                    # Process the complete statement in buffer
                    process_insert_buffer(outfile, buffer, current_table, current_cols)
                    buffer = ""
                    current_table = None
                    current_cols = []

        # Append Sequence Reset
        outfile.write("\n-- Reset sequences\n")
        sequences = [
            ('recipes', 'recipes_id_seq'),
            ('recipe_submission_requests', 'recipe_submission_requests_id_seq'),
            ('admin_requests', 'admin_requests_id_seq'),
            ('reports', 'reports_id_seq'),
            ('ratings', 'ratings_id_seq'),
            ('admin_chat_messages', 'admin_chat_messages_id_seq')
        ]
        
        for table, seq in sequences:
            outfile.write(f"SELECT setval('{seq}', COALESCE((SELECT MAX(id) FROM {table}), 1));\n")

def process_insert_buffer(outfile, buffer, table, cols):
    if not cols:
        # Retry extracting columns from full buffer
        col_match = re.search(r"INSERT INTO `?\w+`?\s*\((.*?)\)", buffer, re.IGNORECASE | re.DOTALL)
        if col_match:
             cols_str = col_match.group(1)
             cols = [c.strip().strip('`') for c in cols_str.split(',')]
        else:
            print(f"Skipping {table}: Could not extract columns.")
            return

    # Extract VALUES part
    # Split by "VALUES"
    parts = re.split(r"VALUES\s*", buffer, 1, flags=re.IGNORECASE)
    if len(parts) < 2:
        return
    
    values_part = parts[1].strip()
    if values_part.endswith(';'):
        values_part = values_part[:-1]

    # Parse rows
    rows = parse_mysql_values(values_part)
    if not rows:
        return

    # Prepare columns for output
    final_table = table_map.get(table, table)
    
    columns_to_exclude = exclude_cols.get(table, set())
    column_renames = rename_cols.get(table, {})
    
    keep_indices = []
    final_cols = []
    
    for idx, col in enumerate(cols):
        if col in columns_to_exclude:
            continue
        keep_indices.append(idx)
        final_cols.append(column_renames.get(col, col))

    # Transform rows
    transformed_rows = []
    for row in rows:
        new_row = []
        
        for idx in keep_indices:
            if idx < len(row):
                val = row[idx].strip() # Strip whitespace
                col_name = cols[idx] # Original column name
                
                # Transformations
                if val == 'NULL':
                    val = 'NULL'
                elif val == '0000-00-00 00:00:00' or val == '0000-00-00':
                    val = 'NULL'
                elif col_name == 'status': # Lowercase status
                     val = val.lower()
                
                # Escape for Postgres
                if val != 'NULL':
                     val_escaped = val.replace("'", "''")
                     val = f"'{val_escaped}'"
                
                new_row.append(val)
            else:
                new_row.append('NULL')
        
        transformed_rows.append(f"({', '.join(new_row)})")

    # chunking output
    if transformed_rows:
        outfile.write(f"INSERT INTO {final_table} ({', '.join(final_cols)}) VALUES\n")
        outfile.write(",\n".join(transformed_rows))
        outfile.write(";\n\n")


if __name__ == "__main__":
    try:
        process_file()
        print("Conversion completed successfully.")
    except Exception as e:
        print(f"Error: {e}")
