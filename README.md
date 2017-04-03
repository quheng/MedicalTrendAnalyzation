# chalk
[![MIT License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![python version](https://img.shields.io/badge/python-3.6.0-blue.svg)](https://www.python.org)
![chalk](http://i4.buimg.com/4851/87539145e3a95c28.png)

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
Using `python process/bag_of_words_builder.py` to build this model, then you can find your result at './data/bag_of_words.json', I also put a sample result there.
The structure of bag of words model is
```
{
   filename:{
      words: amount
   }
}
```

### word relationship
Using `python process/bag_of_words_builder.py` to build. The structure is
```
{
    word: {
        amount: int
        link: {
            word: link_amount
        }
    }
}
```
WARNING: this is to big to handle, for example, in sample data, I got more than 400000 words which mean 10^11 edges.
The final result has more than 700MB, so I just preserve word amount.


### lda model
Using `python process/lda.py` to build. You can find useful information at [lda](http://scikit-learn.org/stable/modules/generated/sklearn.decomposition.LatentDirichletAllocation.html#sklearn.decomposition.LatentDirichletAllocation.perplexity), and sample data at './data/lda'

## visualization
first of all, you should make sure that you have installed `npm` and `node`, [nvm](https://github.com/creationix/nvm) is helpful.

1. install dependencies `npm install`
2. build `npm run build`
3. run `npm start`

now you can visit [http://0.0.0.0:2333](http://0.0.0.0:2333)

## api
### /words-relationship
Due to words relationship is too big to handle, just return words amount now.
```
[
  [words, amount]
]
```

### /lda-topic
Topics and words included in each topic order by weight
```
[
  [words]
]
```

### /lda-doc
Doc topics model
```
[
  [weight]
]
```