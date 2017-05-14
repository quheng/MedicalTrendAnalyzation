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
from util import BAG_OF_WORDS_PATH
from util import WORDS_RELATION_SHIP_PATH


def build_words_relation_ship():
    words_relation_ship = {}
    total_amount = 0
    with open(BAG_OF_WORDS_PATH, 'r', encoding='utf-8') as bag_of_words_file:
        bag_of_words = tqdm(json.load(bag_of_words_file).items())
        for filename, words in bag_of_words:
            bag_of_words.set_description('Processing %s' % filename)
            for word, amount in words.items():
                if word in words_relation_ship:
                    word_amount = words_relation_ship[word]
                    word_amount += amount
                    # for other_word in words.keys():
                    #     if word != other_word:
                    #         if word in word_relation['link']:
                    #             word_relation['link'][other_word] += 1
                    #         else:
                    #             word_relation['link'][other_word] = 1
                else:
                    # word_relation = {
                    #     'amount': amount,
                    #     'link': {}
                    # }
                    word_amount = 1
                words_relation_ship[word] = word_amount
    for word in words_relation_ship.items():
        total_amount += word[1]
    total_word = len(words_relation_ship)
    res = {
        "words_relation_ship": sorted(words_relation_ship.items(), key=lambda d:d[1], reverse=True),
        "total_amount": total_amount,
        "total_word": total_word
    }
    with open(WORDS_RELATION_SHIP_PATH, 'w', encoding='utf-8') as words_relation_ship_file:
        json.dump(res, words_relation_ship_file, ensure_ascii=False)

if __name__ == '__main__':
    build_words_relation_ship()
