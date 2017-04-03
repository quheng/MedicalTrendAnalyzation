# -*- coding: utf-8 -*-
import jieba
import pickle
import sys

from util import VEC_MODEL_PATH
from util import LDA_MODEL_PATH

if __name__ == '__main__':
    lda = pickle.load(open(LDA_MODEL_PATH, 'rb'))
    vectorized = pickle.load(open(VEC_MODEL_PATH, 'rb'))
    vectorized.tokenizer = jieba.cut
    tf = vectorized.transform([sys.argv[1]])
    print(lda.transform(tf)[0])
