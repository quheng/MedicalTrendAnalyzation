import scrapy
import request
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
                yield scrapy.Request(url=f'{url}/{item[id]}', callback=self.parse)



    def parse(self, response):
        # response.css('li.select a::text').extract()
        # page = response.url.split("/")[-2]
        # filename = 'quotes-%s.html' % page
        # with open(filename, 'wb') as f:
        #     f.write(response.body)
        # self.log('Saved file %s' % filename)
        if response.css('li.select a::text').extract_first() in self.category:
            date = response.css('div.title5 p::text').extract_first().split(' ')[1]
            title = response.css('title::text').extract_first()
            cntx = ''.join(response.css('div.text3 p::text').extract())
            filename = f'{date}:{title}.txt'
            with open(f'data/{filename}', 'w') as f:
                f.write(cntx)
            self.log('Saved file %s' % filename)