# -*- coding: utf-8 -*- 
import scrapy


class DxySpider(scrapy.Spider):
    name = "dxy"
    start_urls = ['http://search.dxy.cn/?words=移动医疗&page%d&source=CMS'%x for x in range(1,2)]
       
    def parse(self, response): 
        for div in response.css('div.main-list'):
            href = div.css('h3 a::attr(href)').extract_first()
            print(href)
            date = div.css('p.it-author::text').extract()[2]
            yield scrapy.Request(response.urljoin(href),
                                    callback=self.herf_with_date(date))


    def herf_with_date(self, date):
        def href(response):
            title = response.css('title::text').extract_first()
            cntx = ''.join(response.css('div.content p::text').extract())
            filename = '%s.txt' % sat
            with open(f'dxy/{filename}', 'w') as f:
                f.write(cntx)
            self.log('Saved file %s' % filename)
        return href