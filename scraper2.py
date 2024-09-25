from bs4 import BeautifulSoup
import requests
import re

find_chance = re.compile("(has a \\d{1,3}\\.\\d*%)", re.IGNORECASE)
find_obt = re.compile("(obtained)", re.IGNORECASE)

file1 = open('test.txt', 'a', encoding="utf-8")
file2 = open('t.txt', 'a', encoding="utf-8")

array1 = []
array2 = []
array3 = []
array4 = []

req = requests.get('https://wiki.hypixel.net/Category:Item')
soup = BeautifulSoup(req.content, 'lxml').find_all("a")
for link in soup:
    if re.search("(/index\\.php\\?title=Category:Item&pagefrom)", link['href']):
        category_1 = link['href']
    else:
        array1.append(link['href'])
        file2.write(link['href']+'\n')

req2 = requests.get('https://wiki.hypixel.net/'+category_1)
soup = BeautifulSoup(req2.content, 'lxml').find_all("a")
for link in soup:
    if re.search("(/index\\.php\\?title=Category:Item&pagefrom)", link['href']):
        category_2 = link['href']
    else:
        array2.append(link['href'])
        file2.write(link['href']+'\n')

req3 = requests.get('https://wiki.hypixel.net/'+category_2)
soup = BeautifulSoup(req3.content, 'lxml').find_all("a")
for link in soup:
    if re.search("(/index\\.php\\?title=Category:Item&pagefrom)", link['href']):
        category_3= link['href']
    else:
        array3.append(link['href'])
        file2.write(link['href']+'\n')

req4 = requests.get('https://wiki.hypixel.net/'+category_3)
soup = BeautifulSoup(req4.content, 'lxml').find_all("a")
for link in soup:
    if re.search("(/index\\.php\\?title=Category:Item&pagefrom)", link['href']):
        category_4= link['href']
    else:
        array4.append(link['href'])
        file2.write(link['href']+'\n')

all_links = array1 + array2 + array3 + array4

pagelinks = []
for part in all_links:
    if ("https://" in part) | ("/index.php" in part) | ("/Category" in part) | ("/Main_Page" in part) | ("/Special" in part) | ("#" in part):
        True
    else: 
        pagelinks.append('https://wiki.hypixel.net'+part)

ab = 0
for link in pagelinks:
    linkreq = requests.get(link)
    parsedhtml = BeautifulSoup(linkreq.content, 'lxml').get_text()
    wordlist = parsedhtml.split('\n') 
    if "Obtaining" in wordlist:
        if "%" in wordlist[wordlist.index("Obtaining")+1]:
            print(wordlist[wordlist.index("Obtaining")], ab) 
            ab += 1
            file1.write(wordlist[wordlist.index("Obtaining")+1]+' ' + str(ab)+ '\n')        

