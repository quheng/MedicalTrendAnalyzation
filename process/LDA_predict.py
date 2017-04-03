# -*- coding: utf-8 -*-
import jieba
import pickle

from util import VEC_MODEL_PATH
from util import LDA_MODEL_PATH

if __name__ == '__main__':
    print(LDA_MODEL_PATH)
    lda = pickle.load(open(LDA_MODEL_PATH, 'rb'))
    vectorized = pickle.load(open(VEC_MODEL_PATH, 'rb'))
    vectorized.tokenizer = jieba.cut
    tf = vectorized.transform([test_file, test_file])
    print(lda.transform(tf))
