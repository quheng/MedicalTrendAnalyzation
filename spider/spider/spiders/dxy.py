# -*- coding: utf-8 -*- 
import scrapy


class DxySpider(scrapy.Spider):
    name = "dxy"
    start_urls = ['http://search.dxy.cn/?words=移动医疗&page%d&source=CMS'%x for x in range(1,2)]
       
    def parse(self, response): 
        for div in response.css('div.main-list'):
            href = div.css('h3 a::attr(href)').extract_first().split('?')[0]
            date = div.css('p.it-author::text').extract()[2].strip()
            print('!!!!!!!!!!!!!!!!!!!!!!!!!!')
            print(href)
            yield scrapy.Request(href, callback=self.herf_with_date(date))

    def herf_with_date(self, date):
        def href(response):
            print("!!!!!!")
            print(response.url)
            print(response.text)
            print(dir(response))
        return href