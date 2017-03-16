# -*- coding: utf-8 -*-
import os
import json

from time import time
from tqdm import tqdm

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
RAW_DATA_DIR = os.path.join(BASE_DIR, 'raw_data')
BAG_OF_WORDS_DIR = os.path.join(BASE_DIR, 'data/bag_of_words.json')
STOP_WORDS_DIR = os.path.join(BASE_DIR, 'script/stop_words.txt')


# read bag of word model and build the document word matrix
def __document_word_matrix_builder():
    pass

def LDA_builder():
    pass

if __name__ == '__main__':
    LDA_builder()
