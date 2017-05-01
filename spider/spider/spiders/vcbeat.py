import scrapy
import requests
import json

class VcbeatSpider(scrapy.Spider):
    name = "vcbeat"

    def start_requests(self):
        article_list_url = 'http://www.vcbeat.net/Index/Index/ajaxGetArticleList'
        article_url = 'http://www.vcbeat.net/Index/Index/ajaxGetArticleList'
        categoryId = '2999'
        while True:
            page = 1
            res = requests.post(article_list_url, 
                data = {'categoryId':categoryId, 'page':page})
            res_content = res.content.decode('utf-8-sig')
            print(res_content)
            content = json.loads(res_content)
            if 'data' not in content:
                break
            data = content['data']
            for item in data:
                yield scrapy.Request(url=f'{article_url}/{item[id]}', 
                    callback=self.parse(item['publish_time'], item['title']))



    def parse(self, date, title):
        def lam(self, response):
            content = response.xpath('//div[@class="row"]/div[@id="article-detail"]/div[@id="article-content"]/p/span/text()').extract()
            cntx = ''.join(content)
            filename = f'{date}:{title}.txt'
            with open(f'vcbeat/{filename}', 'w') as f:
                f.write(cntx)
            self.log('Saved file %s' % filename)
        return lam