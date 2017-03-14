# -*- coding: utf-8 -*-
"""
Building bag of words model from raw data.
The model structure is [ { filename: { words: amount }}]
"""

import os
import os.path
import logging
import jieba

RAW_DATA_DIR = './raw_data'


def main():
    """
    main function
    """
    for parent, _, filenames in os.walk(RAW_DATA_DIR):
        for filename in filenames:
            full_file_name = os.path.join(parent, filename)
            with open(full_file_name, 'r', encoding="utf-8") as raw_data:
                try:
                    for line in raw_data.readlines():
                        print(line)
                except Exception as exception:
                    logging.error(f'Error during process {filename}, error message: {exception}')

if __name__ == '__main__':
    main()



