# -*- coding: utf-8 -*- 
import scrapy


class Hc3iSpider(scrapy.Spider):
    name = "hc3i"
    start_urls = ['http://news.hc3i.cn/col/305/list_305_%d.htm'%x for x in range(1,2)]

    def parse(self, response):
        for li in response.css('li.element'):
            href = li.css('a::attr(href)').extract_first()
            yield scrapy.Request(response.urljoin(href), callback=self.article)

    def article(self, response):
        title = response.css('title::text').extract_first()
        date =  response.css('ui.data li::text').extract_first().split(' ')[0]
        content = response.css('div.answer p::text').extract()
        cntx = ''.join(content)
        filename = f'{date}:{title}.txt'
        with open(f'{self.name}/{filename}', 'w') as f:
            f.write(cntx)
        self.log('Saved file %s' % filename)