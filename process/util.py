import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
RAW_DATA_DIR = os.path.join(BASE_DIR, 'raw_data')
TOPIC_PATH = os.path.join(BASE_DIR, 'data/lda/topic.json')
DOC_PATH = os.path.join(BASE_DIR, 'data/lda/doc.json')
LDA_MODEL_PATH = os.path.join(BASE_DIR, 'data/lda/lda_model.pkl')
VEC_MODEL_PATH = os.path.join(BASE_DIR, 'data/lda/vec_model.pkl')

STOP_WORDS_PATH = os.path.join(BASE_DIR, 'process/stop_words.txt')

STOP_WORDS = set(line.strip() for line in open(STOP_WORDS_PATH, 'r', encoding='utf-8').readlines())
STOP_WORDS.add('生物谷')
