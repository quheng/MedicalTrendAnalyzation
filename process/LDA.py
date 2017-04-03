# -*- coding: utf-8 -*-
import os
import jieba
import time
import json
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
RAW_DATA_DIR = os.path.join(BASE_DIR, 'raw_data')
TOPIC_PATH = os.path.join(BASE_DIR, 'data/lda/topic.json')
DOC_PATH = os.path.join(BASE_DIR, 'data/lda/doc.json')
LDA_MODEL_PATH = os.path.join(BASE_DIR, 'data/lda/lda_model.pkl')

STOP_WORDS_PATH = os.path.join(BASE_DIR, 'process/stop_words.txt')

STOP_WORDS = set(line.strip() for line in open(STOP_WORDS_PATH, 'r', encoding='utf-8').readlines())
STOP_WORDS.add('生物谷')

TOPICS_NUMBER = 4
TOPICS_WORD = 6

def __get_row_data():
    """
    build bag of words model
    """
    raw_data = []
    files_info = []
    t0 = time.time()
    print('reading raw data')
    for parent, _, file_names in os.walk(RAW_DATA_DIR):
        for filename in file_names:
            full_file_name = os.path.join(parent, filename)
            with open(full_file_name, 'r', encoding='utf-8') as file_data:
                raw_data.append(file_data.read())
                file_info = filename.split(':')
                files_info.append({'date':file_info[0], 'filename': file_info[1][:-4]})
    print(f'got {len(raw_data)} files in {time.time()-t0}s')
    return files_info, raw_data


def __vectorizer(raw_data):
    print('extracting tf features')
    t0 = time.time()
    vectorizer = CountVectorizer(max_df=0.8,
                                 min_df=0.01,
                                 stop_words=STOP_WORDS,
                                 analyzer='word',
                                 tokenizer=jieba.cut)
    tf = vectorizer.fit_transform(raw_data)
    print(f'finish in {time.time()-t0}s, got {len(vectorizer.get_feature_names())} words')
    return vectorizer, tf


def __build_lda_model(tf):
    lda = LatentDirichletAllocation(n_topics=TOPICS_NUMBER,
                                    max_iter=5,
                                    learning_method='online',
                                    learning_offset=50.,
                                    random_state=0)
    t0 = time.time()
    print('building lda model')
    lda.fit(tf)
    print(f'done in {time.time() - t0}')
    return lda


def __topic_list(lda, feature_names):
    topic_list = []
    for topic_idx, topic in enumerate(lda.components_):
        topic_list.append([feature_names[i] for i in topic.argsort()[:-TOPICS_WORD - 1:-1]])
    return topic_list

def __set_lda_info_to_file_info(file_info, lda_model):
    for index, item in enumerate(file_info):
        item['lda'] = lda_model[index].tolist()

if __name__ == '__main__':
    file_info, raw_data = __get_row_data()
    vectorizer, tf = __vectorizer(raw_data)
    lda = __build_lda_model(tf)
    topic_list = __topic_list(lda, vectorizer.get_feature_names())
    __set_lda_info_to_file_info(file_info, lda.transform(tf))
    print('saving model')
    pickle.dump(pickle.dump, open(LDA_MODEL_PATH, 'wb'))
    json.dump(topic_list, open(TOPIC_PATH, 'w'), ensure_ascii=False)
    json.dump(file_info, open(DOC_PATH, 'w'), ensure_ascii=False)
