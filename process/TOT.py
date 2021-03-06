# Copyright 2015 Abhinav Maurya

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


import os
import random
import scipy.special
import numpy as np
import scipy.stats
import jieba
import json
import time
import datetime

from copy import deepcopy
from tqdm import tqdm
from util import RAW_DATA_DIR
from util import STOP_WORDS
from util import TOT_MODEL_PATH

date_format = 'YYYY-MM'


def __time_string2timestamp(time_string):
    date = datetime.datetime.strptime(time_string, "%Y-%m-%d")
    date.replace(day=1)
    return time.mktime(date.timetuple())


def __file2word_list(filename):
    with open(filename, 'r', encoding='utf-8') as raw_data:
        try:
            word_list = []
            for line in raw_data.readlines():
                seg_list_stop_words = map(lambda word: word.strip(), jieba.cut(line, cut_all=False))
                seg_list = filter(lambda word: word and word not in STOP_WORDS, seg_list_stop_words)
                word_list.extend(seg_list)
            return word_list
        except Exception as exception:
            print(f'Error during process {filename}, error message: {exception}')


def __timestamps_normalizing(timestamps):
    max_timestamps = max(timestamps)
    min_timestamps = min(timestamps)
    delta = max_timestamps - min_timestamps
    return [(timestamp - min_timestamps) / delta for timestamp in timestamps]


def get_documents_and_dictionary():
    documents = []
    timestamps = []
    dictionary = set()

    for parent, _, file_names in os.walk(RAW_DATA_DIR):
        print(f'got {len(file_names)} files')
        pb_file_names = tqdm(file_names)
        for filename in pb_file_names:
            pb_file_names.set_description('Processing %s' % filename)
            full_file_name = os.path.join(parent, filename)
            word_list = __file2word_list(full_file_name)
            documents.append(word_list)
            for word in word_list:
                dictionary.add(word)

            time_string = filename.split(':')[0]
            timestamps.append(__time_string2timestamp(time_string))

    return documents, __timestamps_normalizing(timestamps), list(dictionary)


def calculate_counts(par):
    for d in range(par['D']):
        for i in range(par['N'][d]):
            topic_di = par['z'][d][i]  # topic in doc d at position i
            word_di = par['w'][d][i]  # word ID in doc d at position i
            par['theta'][d][topic_di] += 1
            par['n'][topic_di][word_di] += 1
            par['n_sum'][topic_di] += 1


def initialize_parameters(documents, timestamps, dictionary):
    par = {}
    par['max_iterations'] = 1000
    par['T'] = 10
    par['D'] = len(documents)
    par['V'] = len(dictionary)
    par['N'] = [len(doc) for doc in documents]
    par['alpha'] = [50.0 / par['T'] for _ in range(par['T'])]
    par['beta'] = [0.1 for _ in range(par['V'])]
    par['beta_sum'] = sum(par['beta'])
    par['psi'] = [[1 for _ in range(2)] for _ in range(par['T'])]
    par['betafunc_psi'] = [scipy.special.beta(par['psi'][t][0], par['psi'][t][1]) for t in range(par['T'])]
    par['word_id'] = {dictionary[i]: i for i in range(len(dictionary))}
    par['word_token'] = dictionary
    par['z'] = [[random.randrange(0, par['T']) for _ in range(par['N'][d])] for d in range(par['D'])]
    par['t'] = [[timestamps[d] for _ in range(par['N'][d])] for d in range(par['D'])]
    par['w'] = [[par['word_id'][documents[d][i]] for i in range(par['N'][d])] for d in range(par['D'])]
    par['theta'] = [[0 for t in range(par['T'])] for d in range(par['D'])]
    par['n'] = [[0 for v in range(par['V'])] for t in range(par['T'])]
    par['n_sum'] = [0 for t in range(par['T'])]
    np.set_printoptions(threshold=np.inf)
    np.seterr(divide='ignore', invalid='ignore')
    calculate_counts(par)
    return par


def get_topic_timestamps(par):
    topic_timestamps = []
    for topic in range(par['T']):
        current_topic_timestamps = []
        current_topic_doc_timestamps = [[(par['z'][d][i] == topic) * par['t'][d][i] for i in range(par['N'][d])] for
                                        d in range(par['D'])]
        for d in range(par['D']):
            current_topic_doc_timestamps[d] = filter(lambda x: x != 0, current_topic_doc_timestamps[d])
        for timestamps in current_topic_doc_timestamps:
            current_topic_timestamps.extend(timestamps)
        assert current_topic_timestamps != []
        topic_timestamps.append(current_topic_timestamps)
    return topic_timestamps


def estimates_psi(par):
    topic_timestamps = get_topic_timestamps(par)
    psi = [[1 for _ in range(2)] for _ in range(len(topic_timestamps))]
    for i in range(len(topic_timestamps)):
        current_topic_timestamps = topic_timestamps[i]
        timestamp_mean = np.mean(current_topic_timestamps)
        timestamp_var = np.var(current_topic_timestamps)
        if timestamp_var == 0:
            timestamp_var = 1e-6
        common_factor = timestamp_mean * (1 - timestamp_mean) / timestamp_var - 1
        psi[i][0] = 1 + timestamp_mean * common_factor
        psi[i][1] = 1 + (1 - timestamp_mean) * common_factor
    return psi


def estimates_theta_phi(par):
    theta = deepcopy(par['theta'])
    phi = deepcopy(par['n'])
    for d in range(par['D']):
        if sum(theta[d]) == 0:
            theta[d] = np.asarray([1.0 / len(theta[d]) for _ in range(len(theta[d]))])
        else:
            theta[d] = np.asarray(theta[d])
            theta[d] = 1.0 * theta[d] / sum(theta[d])
    theta = np.asarray(theta)
    for t in range(par['T']):
        if sum(phi[t]) == 0:
            phi[t] = np.asarray([1.0 / len(phi[t]) for _ in range(len(phi[t]))])
        else:
            phi[t] = np.asarray(phi[t])
            phi[t] = 1.0 * phi[t] / sum(phi[t])
    phi = np.asarray(phi)
    return theta, phi


def gibbs_sampling(par):
    for iteration in range(par['max_iterations']):
        for d in range(par['D']):
            for i in range(par['N'][d]):
                word_di = par['w'][d][i]
                t_di = par['t'][d][i]
                old_topic = par['z'][d][i]
                par['theta'][d][old_topic] -= 1
                par['n'][old_topic][word_di] -= 1
                par['n_sum'][old_topic] -= 1
                topic_probabilities = []
                for topic_di in range(par['T']):
                    psi_di = par['psi'][topic_di]
                    if psi_di[0] == 1 or psi_di[1] == 1:
                        topic_probabilities.append(1)
                    else:
                        topic_probability = 1.0 * (par['theta'][d][topic_di] + par['alpha'][topic_di])
                        topic_probability *= ((1 - t_di) ** (psi_di[0] - 1)) * ((t_di) ** (psi_di[1] - 1))
                        topic_probability /= par['betafunc_psi'][topic_di]
                        topic_probability *= (par['n'][topic_di][word_di] + par['beta'][word_di])
                        topic_probability /= (par['n_sum'][topic_di] + par['beta_sum'])
                sum_topic_probabilities = sum(topic_probabilities)
                if sum_topic_probabilities == 0:
                    topic_probabilities = [1.0 / par['T'] for _ in range(par['T'])]
                else:
                    topic_probabilities = [p / sum_topic_probabilities for p in topic_probabilities]
                new_topic = list(np.random.multinomial(1, topic_probabilities, size=1)[0]).index(1)
                par['z'][d][i] = new_topic
                par['theta'][d][new_topic] += 1
                par['n'][new_topic][word_di] += 1
                par['n_sum'][new_topic] += 1
            if d % 100 == 0:
                print('Done with iteration {iteration} and document {document}'.format(iteration=iteration,
                                                                                       document=d))
        par['psi'] = estimates_psi(par)
        par['betafunc_psi'] = [scipy.special.beta(par['psi'][t][0], par['psi'][t][1]) for t in range(par['T'])]
    par['theta'], par['n'] = estimates_theta_phi(par)
    return par['theta'], par['n'], par['psi']


if __name__ == "__main__":
    resultspath = '../data/tot/'

    documents, timestamps, dictionary = get_documents_and_dictionary()
    par = initialize_parameters(documents, timestamps, dictionary)
    theta, phi, psi = gibbs_sampling(par)
    tot_pickle = open(TOT_MODEL_PATH, 'wb')
    json.dump(par, tot_pickle)
    tot_pickle.close()
