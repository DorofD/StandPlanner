from atlassian import Confluence
import json

confluence = Confluence(
    url='https://confluence.kraftway.ru/',
    username='user',
    password='password'
)

page = confluence.get_page_by_id(122455943, expand='body.storage')
with open('data.json', 'w', encoding='utf-8') as file:
    json.dump(page, file, ensure_ascii=False, indent=4)
