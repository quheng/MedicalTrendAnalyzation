# -*- coding: utf-8 -*-
"""
Building bag of words model from raw data.
The model structure is [ { filename: { words: amount }}]
"""

import os
import os.path
import logging
import jieba
import json

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
RAW_DATA_DIR = f'{BASE_DIR}/raw_data'
BAG_OF_WORDS = f'{BASE_DIR}/data/bag_of_words.json'

STOP_WORDS = set(line.strip() for line in open(f'{BASE_DIR}/script/stop_words.txt', 'r', encoding='utf-8').readlines())
STOP_WORDS.add("生物谷")

def main():
    """
    main function
    """
    bag_of_word = []

    for parent, _, file_names in os.walk(RAW_DATA_DIR):
        for filename in file_names:
            full_file_name = os.path.join(parent, filename)
            with open(full_file_name, 'r', encoding='utf-8') as raw_data:
                try:
                    word_list = {}
                    for line in raw_data.readlines():
                        seg_list_stop_words = map(lambda word:word.strip(), jieba.cut(line, cut_all=False))
                        seg_list = filter(lambda word:word and word not in STOP_WORDS, seg_list_stop_words)
                        for word in seg_list:
                            if word in word_list:
                                word_list[word] += 1
                            else:
                                word_list[word] = 1
                    bag_of_word.append({filename: word_list})
                except Exception as exception:
                    logging.error(f"Error during process {filename}, error message: {exception}")
    with open(BAG_OF_WORDS, 'w', encoding='utf-8') as result_file:
        # result_file.write(json.dumps(bag_of_word, ensure_ascii=False))
        json.dump(bag_of_word, result_file, ensure_ascii=False)

if __name__ == '__main__':
    main()


