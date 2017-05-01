import scrapy
import requests
import json
import time 

class VcbeatSpider(scrapy.Spider):
    name = "vcbeat"

    def start_requests(self):
        article_list_url = 'http://www.vcbeat.net/Index/Index/ajaxGetArticleList'
        article_url = 'http://www.vcbeat.net'
        categoryId = '2999'
        page = 3
        while True:
            res = requests.post(article_list_url, 
                data = {'categoryId':categoryId, 'page':page})
            print('page: ', page)
            while res.status_code == 404:
                print('@@@@@ retry')
                time.sleep(3)
                res = requests.post(article_list_url, 
                    data = {'categoryId':categoryId, 'page':page})
            content = json.loads(res.content.decode('utf-8-sig'))
            if content['status'] != 1:
                break
            data = content['data']
            for item in data:
                yield scrapy.Request(url=f'''{article_url}/{item['id']}''', 
                    callback=self.parse(item['publish_time'], item['title']))
            page += 1



    def parse(self, date, title):
        def lam(response):
            content = response.xpath('//div[@class="row"]/div[@id="article-detail"]/div[@id="article-content"]/p/span/text()').extract()
            content.extend(response.xpath('//div[@class="row"]/div[@id="article-detail"]/div[@id="article-content"]/p/text()').extract())
            content.extend(response.xpath('//div[@class="row"]/div[@id="article-detail"]/div[@id="article-content"]/sector/p/text()').extract())
            content.extend(response.xpath('//div[@class="row"]/div[@id="article-detail"]/div[@id="article-content"]/section/p/text()').extract())
            cntx = ''.join(content)
            filename = f'{date}:{title}.txt'
            with open(f'vcbeat/{filename}', 'w') as f:
                f.write(cntx)
            self.log('Saved file %s' % filename)
        return lam