# -*- coding: utf-8 -*- 
import scrapy


class BioonSpider(scrapy.Spider):
    name = "bioon"
    start_urls = ['http://news.bioon.com/research/list-%d.html'%x for x in range(1,50)]
    
    def parse(self, response):
        for div in response.css('div.cntx'):
            href = div.css('a::attr(href)').extract_first()
            date = div.css('div.fl.huise::text').extract_first()
            yield scrapy.Request(response.urljoin(href),
                                    callback=self.herf_with_date(date))


    def herf_with_date(self, date):
        def href(response):
            title = response.css('title::text').extract_first()
            cntx = ''.join(response.css('div.text3 p::text').extract())
            sat = date + ":" + title.replace("/",",").replace(":","-")
            filename = '%s.txt' % sat
            with open(filename, 'w') as f:
                f.write(date)
                f.write("\n")
                f.write(title)
                f.write("\n")
                f.write(cntx)
            self.log('Saved file %s' % filename)
        return href