import re
import requests
from bs4 import BeautifulSoup
import time

site = 'http://muzendo.jp/blog/?p=19'

response = requests.get(site)

soup = BeautifulSoup(response.text, 'html.parser')
a_tags = soup.find_all('a')

urls = [a['href'] for a in a_tags]

for url in urls:
    time.sleep(3)
    filename = re.search(r'/([\w_-]+[.](jpg|gif|png))$', url)
    if not filename:
         print("Regex didn't match with the url: {}".format(url))
         continue
    with open(filename.group(1), 'wb') as f:
        if 'http' not in url:
            # sometimes an image source can be relative
            # if it is provide the base url which also happens
            # to be the site variable atm.
            url = '{}{}'.format(site, url)
        response = requests.get(url)
        f.write(response.content)