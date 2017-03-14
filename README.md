# chalk
This is a project to do some medical trend analysis and visualization.

## environment
1. python 3.6

## dependencies
Use `pip install -r requirements.txt` to install dependencies.

## raw data
Put your data in ./raw_data folder and named your articles with '%Y-%m-%d:article_name' format. eg:"2010-06-01:血管机器人可在血管内自由移动并清除血栓 - 移动医疗专区 - 生物谷"

## process data
### bag of words model
You can find some useful information about bag of words at [bag of words model](https://en.wikipedia.org/wiki/Bag-of-words_model).
Using `python script/bag_of_words_builder.py` to build this model, then you can find your result at './data/bag_of_words.json', I also put a sample result there.
