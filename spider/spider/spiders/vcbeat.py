import scrapy
import requests
import json

class VcbeatSpider(scrapy.Spider):
    name = "vcbeat"

    def start_requests(self):
        article_list_url = 'http://www.vcbeat.net/Index/Index/ajaxGetArticleList'
        article_url = 'http://www.vcbeat.net/Index/Index/ajaxGetArticleList'
        categoryId = '2999'
        page = 1
        while True:
            res = requests.post(article_list_url, 
                data = {'categoryId':categoryId, 'page':page})
            content = json.loads(res.content.decode('utf-8-sig'))
            if 'data' not in content:
                break
            data = content['data']
            for item in data:
                yield scrapy.Request(url=f'''{article_url}/{item['id']}''', 
                    callback=self.parse(item['publish_time'], item['title']))
            page += 1



    def parse(self, date, title):
        def lam(response):
            content = response.xpath('//div[@class="row"]/div[@id="article-detail"]/div[@id="article-content"]/p/span/text()').extract()
            cntx = ''.join(content)
            filename = f'{date}:{title}.txt'
            with open(f'vcbeat/{filename}', 'w') as f:
                f.write(cntx)
            self.log('Saved file %s' % filename)
        return lam