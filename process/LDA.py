# -*- coding: utf-8 -*-
import jieba
import time
import json
import pickle
import os
import logging
import sys
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation

from util import BASE_DIR
from util import RAW_DATA_DIR
from util import STOP_WORDS
from util import DOC_PATH
from util import TOPIC_PATH
from util import VEC_MODEL_PATH
from util import LDA_MODEL_PATH

logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)

CONFIG_PATH = os.path.join(BASE_DIR, 'process', 'LDA_config.json')

def __get_row_data():
    """
    build bag of words model
    """
    raw_data = []
    files_info = []
    t0 = time.time()
    logging.info('reading raw data')
    for parent, _, file_names in os.walk(RAW_DATA_DIR):
        for filename in file_names:
            full_file_name = os.path.join(parent, filename)
            with open(full_file_name, 'r', encoding='utf-8') as file_data:
                raw_data.append(file_data.read())
                file_info = filename.split(':')
                files_info.append({'date':file_info[0], 'filename': file_info[1][:-4]})
    logging.info(f'got {len(raw_data)} files in {time.time()-t0}s')
    return files_info, raw_data


def __vectorized(raw_data, max_df, min_df):
    logging.info('extracting tf features')
    t0 = time.time()
    vectorizer = CountVectorizer(max_df=max_df,
                                 min_df=min_df,
                                 stop_words=STOP_WORDS,
                                 analyzer='word',
                                 tokenizer=jieba.cut)
    tf= vectorizer.fit_transform(raw_data)
    logging.info(f'finish in {time.time()-t0}s')
    return vectorizer, tf


def __build_lda_model(tf, topic_amount, max_iter):
    t0 = time.time()
    logging.info('building lda model')
    lda = LatentDirichletAllocation(n_topics=topic_amount,
                                    learning_method='online',
                                    max_iter=max_iter,
                                    learning_offset=50.,
                                    random_state=0)
    lda.fit(tf)
    logging.info(f'done in {time.time() - t0}')
    return lda


def __topic_list(lda, feature_names):
    topic_list = []
    for topic_idx, topic in enumerate(lda.components_):
        topic_list.append([feature_names[i] for i in topic.argsort()[:-topic_keywords - 1:-1]])
    return topic_list


def __set_lda_info_to_file_info(file_info, tf, lda):
    lda_model = lda.transform(tf)

    for index, item in enumerate(file_info):
        item['lda'] = lda_model[index].tolist()

if __name__ == '__main__':
    if len(sys.argv) > 1:
        config = json.loads(sys.argv[1])
    else:
        config = json.load(open(CONFIG_PATH, 'r'))

    max_df = config['max_df']
    min_df = config['min_df']
    topic_amount = config['topic_amount']
    topic_keywords = config['topic_keywords']
    max_iter = config['max_iter']
    is_saving = 'is_saving' in config and config['is_saving']

    file_info, raw_data = __get_row_data()

    vectorizer, tf = __vectorized(raw_data, max_df, min_df)
    lda = __build_lda_model(tf, topic_amount, max_iter)
    topic_list = __topic_list(lda, vectorizer.get_feature_names())
    __set_lda_info_to_file_info(file_info, tf, lda)
    config['perplexity'] = lda.perplexity(tf)

    if is_saving:
        logging.info('saving model')
        vectorizer.tokenizer = None  # we can not pickle jieba due to lock
        pickle.dump(lda, open(LDA_MODEL_PATH, 'wb'))
        pickle.dump(vectorizer, open(VEC_MODEL_PATH, 'wb'))
        json.dump(topic_list, open(TOPIC_PATH, 'w'), ensure_ascii=False)
        json.dump(file_info, open(DOC_PATH, 'w'), ensure_ascii=False)
        json.dump(config, open(CONFIG_PATH, 'w'), ensure_ascii=False)
    print(json.dumps(config, ensure_ascii=False))
