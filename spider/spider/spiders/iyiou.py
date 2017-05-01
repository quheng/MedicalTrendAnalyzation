# -*- coding: utf-8 -*- 
import scrapy


class IyiouSpider(scrapy.Spider):
    name = "iyiou"
    start_urls = ['http://www.iyiou.com/t/yidongyiliao/page/%d.html'%x for x in range(1,16)]

    def parse(self, response):
        for li in response.css('li.clearFix'):
            href = li.css('a::attr(href)').extract_first()
            yield scrapy.Request(response.urljoin(href), callback=self.article)

    def article(self, response):
        title = response.css('title::text').extract_first()
        date =  response.xpath('//div[@id="post_date"]/text()').extract_first().split(' ')[0]
        content = response.xpath('//div[@id="post_description"]/p/strong/text()').extract()
        content.extend(response.xpath('//div[@id="post_description"]/p/text()').extract())
        cntx = ''.join(content)
        filename = f'{date}:{title}.txt'
        print(filename)
        with open(f'iyiou/{filename}', 'w') as f:
            f.write(cntx)
        self.log('Saved file %s' % filename)