# from bs4 import BeautifulSoup
# import json


# class HTMLParser():
#     def __init__(self, page_layout):
#         self.soup = BeautifulSoup(page_layout, 'html.parser')
#         self.key_tags = {
#             'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'div', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot',
#             'colgroup', 'col', 'p', 'ul', 'ol', 'li', 'span', 'blockquote', 'pre', 'a', 'br'
#         }

#     def convert_to_json(self):
#         full_tree = self.get_full_data_tree()
#         cleaned_tree = self.build_key_tag_tree(full_tree)

#         result = []
#         for note in full_tree:
#             cleaned_tree = self.build_key_tag_tree(note)
#             result.append(cleaned_tree)
#         return json.dumps(result)

#     def get_full_data_tree(self):
#         """Возвращает список словарей корневых элементов"""

#         def tag_to_dict(tag):
#             if tag.name is None:
#                 text = tag.strip()
#                 return text if text else None

#             result = {'tag': tag.name}
#             if tag.attrs:
#                 result['attrs'] = tag.attrs

#             children = []
#             for child in tag.children:
#                 child_dict = tag_to_dict(child)
#                 if child_dict:
#                     children.append(child_dict)
#             if children:
#                 result['children'] = children

#             return result
#         roots = [el for el in self.soup.contents if el.name is not None]
#         tree = [tag_to_dict(root) for root in roots]
#         return tree

#     def build_key_tag_tree(self, node):
#         """
#         Вернёт дерево элементов, состоящее только из тегов, указанных в self.key_tags и текста элементов
#         Всё остальное будет отброшено
#         """
#         if isinstance(node, str):
#             # Текстовой узел — возвращаем его наверх
#             return node

#         if not isinstance(node, dict):
#             return None

#         tag = node.get('tag')
#         children = node.get('children', [])

#         # Если это не ключевой тег — идём в детей и возвращаем их (собирая в список)
#         if tag not in self.key_tags:
#             result = []
#             for child in children:
#                 subtree = self.build_key_tag_tree(child)
#                 if subtree:
#                     if isinstance(subtree, list):
#                         result.extend(subtree)
#                     else:
#                         result.append(subtree)
#             return result if result else None

#         # Если это ключевой тег — строим дерево
#         result = {'tag': tag}
#         child_trees = []
#         for child in children:
#             subtree = self.build_key_tag_tree(child)
#             if subtree:
#                 if isinstance(subtree, list):
#                     child_trees.extend(subtree)
#                 elif isinstance(subtree, str):
#                     # Текстовый узел внутри ключевого тега
#                     child_trees.append({'text': subtree})
#                 else:
#                     child_trees.append(subtree)
#         if child_trees:
#             result['children'] = child_trees
#         return result


from bs4 import BeautifulSoup
import json


# class HTMLParser():
#     def __init__(self, page_layout):
#         self.soup = BeautifulSoup(page_layout, 'html.parser')
#         # self.remove_styles(self.soup)
#         self.remove_styles_and_classes(self.soup)

#     def remove_styles_and_classes(self, soup):
#         # Удаляем все теги <style>
#         for style in soup.find_all('style'):
#             style.decompose()
#         # for br in soup.find_all('br'):
#         #     br.replace_with('\n')
#         # for br in soup.find_all('br'):
#         #     br.decompose()
#         # Удаляем все style- и class-атрибуты
#         for tag in soup.find_all(True):  # True — все теги
#             if 'style' in tag.attrs:
#                 del tag.attrs['style']
#             if 'class' in tag.attrs:
#                 del tag.attrs['class']

#     def convert_to_json(self):
#         def element_to_dict(element):
#             if isinstance(element, str):
#                 return element.strip() if element.strip() else None
#             result = {
#                 'tag': element.name,
#                 'attrs': dict(element.attrs),
#                 'children': []
#             }
#             for child in element.children:
#                 child_dict = element_to_dict(child)
#                 if child_dict:
#                     result['children'].append(child_dict)
#             return result

#         roots = []
#         for child in self.soup.contents:
#             d = element_to_dict(child)
#             if d:
#                 roots.append(d)
#         return json.dumps(roots)


class HTMLParser():
    def __init__(self, page_layout):
        # print(type(page_layout))
        self.soup = BeautifulSoup(page_layout, 'html.parser')
        self.remove_styles_and_classes(self.soup)

    def remove_styles_and_classes(self, soup):
        for style in soup.find_all('style'):
            style.decompose()
        for tag in soup.find_all(True):
            if 'style' in tag.attrs:
                del tag.attrs['style']
            if 'class' in tag.attrs:
                del tag.attrs['class']

    def convert_to_json(self):
        def element_to_dict(element):
            if isinstance(element, str):
                return element.strip() if element.strip() else None
            # Обработка одиночных тегов
            if element.name in ['br', 'hr', 'img']:
                return {
                    'tag': element.name,
                    'attrs': dict(element.attrs),
                    'children': []
                }
            result = {
                'tag': element.name,
                'attrs': dict(element.attrs),
                'children': []
            }
            for child in element.children:
                child_dict = element_to_dict(child)
                if child_dict:
                    result['children'].append(child_dict)
            return result

        roots = []
        for child in self.soup.contents:
            d = element_to_dict(child)
            if d:
                roots.append(d)
        return json.dumps(roots)
