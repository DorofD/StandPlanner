from bs4 import BeautifulSoup
from app.repository.queries.stands import DBStands
import json

# stand = DBStands().get_stand(3)
# page_layout = stand['page_layout']


class HTMLParser():
    def __init__(self, page_layout):
        # для Confluence storage лучше парсер 'xml', надо сделать
        self.soup = BeautifulSoup(page_layout, 'html.parser')
        self.key_tags = {
            'div', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot',
            'colgroup', 'col', 'p', 'ul', 'ol', 'li', 'span'
        }

    def convert_confluence_storage_into_json(self):
        full_tree = self.get_full_data_tree()
        cleaned_tree = self.build_key_tag_tree(full_tree)

        result = []
        for note in full_tree:
            cleaned_tree = self.build_key_tag_tree(note)
            result.append(cleaned_tree)
        return json.dumps(result)

    def get_full_data_tree(self):
        """Возвращает список словарей корневых элементов"""

        def tag_to_dict(tag):
            if tag.name is None:
                text = tag.strip()
                return text if text else None

            result = {'tag': tag.name}
            if tag.attrs:
                result['attrs'] = tag.attrs

            children = []
            for child in tag.children:
                child_dict = tag_to_dict(child)
                if child_dict:
                    children.append(child_dict)
            if children:
                result['children'] = children

            return result
        roots = [el for el in self.soup.contents if el.name is not None]
        tree = [tag_to_dict(root) for root in roots]
        return tree

    def build_key_tag_tree(self, node):
        """
        Вернёт дерево элементов, состоящее только из тегов, указанных в self.key_tags и текста элементов
        Всё остальное будет отброшено
        """
        if isinstance(node, str):
            # Текстовой узел — возвращаем его наверх
            return node

        if not isinstance(node, dict):
            return None

        tag = node.get('tag')
        children = node.get('children', [])

        # Если это не ключевой тег — идём в детей и возвращаем их (собирая в список)
        if tag not in self.key_tags:
            result = []
            for child in children:
                subtree = self.build_key_tag_tree(child)
                if subtree:
                    if isinstance(subtree, list):
                        result.extend(subtree)
                    else:
                        result.append(subtree)
            return result if result else None

        # Если это ключевой тег — строим дерево
        result = {'tag': tag}
        child_trees = []
        for child in children:
            subtree = self.build_key_tag_tree(child)
            if subtree:
                if isinstance(subtree, list):
                    child_trees.extend(subtree)
                elif isinstance(subtree, str):
                    # Текстовый узел внутри ключевого тега
                    child_trees.append({'text': subtree})
                else:
                    child_trees.append(subtree)
        if child_trees:
            result['children'] = child_trees
        return result
