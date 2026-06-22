import sys, re
sys.stdout.reconfigure(encoding='utf-8')
with open('assets/js/games-data.js', 'r', encoding='utf-8') as f:
    content = f.read()
opens = content.count('[')
closes = content.count(']')
obrace = content.count('{')
cbrace = content.count('}')
print(f'Square brackets: {opens} open, {closes} close')
print(f'Curly braces: {obrace} open, {cbrace} close')
if 'const GAMES_DATABASE' in content:
    print('GAMES_DATABASE const found')
    item_count = content.count('id:')
    print(f'Items with id: field: {item_count}')
