import scrapy

class QuotesSpider(scrapy.Spider):
    name = "bioon"
    start = 6575000
    category = set(['移动医疗 »'])

    def start_requests(self):
        for idnex in range(self.start, 6702882):
            url = f'http://news.bioon.com/article/{idnex}.html'
            yield scrapy.Request(url=url, callback=self.parse)

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