import scrapy
import requests
import json

class VcbeatSpider(scrapy.Spider):
    name = "bioon"

    def start_requests(self):
        article_list_url = 'http://www.vcbeat.net/Index/Index/ajaxGetArticleList'
        article_url = 'http://www.vcbeat.net/Index/Index/ajaxGetArticleList'
        categoryId = 'http://www.vcbeat.net'
        while True:
            page = 1
            res = requests.post(url, 
                data = {'categoryId':categoryId, 'page':page})
            content = json.loads(res.content.decode('utf-8-sig'))
            if 'data' not in content:
                break
            data = content['data']
            for item in data:
                yield scrapy.Request(url=f'{url}/{item[id]}', 
                    callback=self.parse(item['publish_time'], item['title']))



    def parse(self, date, title):
        def lam(self, response):
            content = response.xpath('//div[@class="row"]/div[@id="article-detail"]/div[@id="article-content"]/p/span/text()').extract()
            cntx = ''.join(content)
            filename = f'{date}:{title}.txt'
            with open(f'data/{filename}', 'w') as f:
                f.write(cntx)
            self.log('Saved file %s' % filename)
        return lam