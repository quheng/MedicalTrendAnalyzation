# -*- coding: utf-8 -*-
"""
Building bag of words model from raw data.
The model structure is { filename: { words: amount } }
"""

import os
import jieba
import json

from tqdm import tqdm
from util import STOP_WORDS
from util import RAW_DATA_DIR
from util import BAG_OF_WORDS_PATH


def build_bag_of_words_model():
    """
    build bag of words model
    """
    bag_of_word = {}
    count = 0
    err = 0
    for parent, _, file_names in os.walk(RAW_DATA_DIR):
        print(f'got {len(file_names)} files')
        pb_file_names = tqdm(file_names)
        for filename in pb_file_names:
            pb_file_names.set_description('Processing %s' % filename)
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
                    bag_of_word[filename] = word_list
                    count += 1
                except Exception as exception:
                    err += 1
                    print(f'Error during process {filename}, error message: {exception}')
    with open(BAG_OF_WORDS_PATH, 'w', encoding='utf-8') as result_file:
        json.dump(bag_of_word, result_file, ensure_ascii=False)
    print(f'finish, {count} success, {err} failed')

if __name__ == '__main__':
    build_bag_of_words_model()


