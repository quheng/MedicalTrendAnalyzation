# -*- coding: utf-8 -*-
"""
Building relationship between words
The structure is {
    word: {
        amount: int
        link: {
            word: link_amount
        }
    }
}
"""
import os
import json

from tqdm import tqdm

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
BAG_OF_WORDS_DIR = os.path.join(BASE_DIR, 'data/bag_of_words.json')
WORDS_RELATION_SHIP_DIR = os.path.join(BASE_DIR, 'data/words_relationship.json')


def build_words_relation_ship():
    words_relation_ship = {}
    with open(BAG_OF_WORDS_DIR, 'r', encoding='utf-8') as bag_of_words_file:
        bag_of_words = tqdm(json.load(bag_of_words_file).items())
        for filename, words in bag_of_words:
            bag_of_words.set_description('Processing %s' % filename)
            for word, amount in words.items():
                if word in words_relation_ship:
                    word_relation = words_relation_ship[word]
                    word_relation['amount'] += amount
                    for other_word in words.keys():
                        if word != other_word:
                            if word in word_relation['link']:
                                word_relation['link'][other_word] += 1
                            else:
                                word_relation['link'][other_word] = 1
                else:
                    word_relation = {
                        'amount': amount,
                        'link': {}
                    }
                words_relation_ship[word] = word_relation
    with open(WORDS_RELATION_SHIP_DIR, 'w', encoding='utf-8') as words_relation_ship_file:
        json.dump(words_relation_ship, words_relation_ship_file, ensure_ascii=False)

if __name__ == '__main__':
    build_words_relation_ship()
