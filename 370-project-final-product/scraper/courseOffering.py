# import sys
# import requests
# from time import sleep
# from json import loads
from bs4 import BeautifulSoup
import os

currentDirectory = os.path.join(os.getcwd(), "courseOfferings")
print(currentDirectory)
files = (file for file in os.listdir(currentDirectory) 
         if os.path.isfile(os.path.join(currentDirectory, file)))

for term in files:
    term = "courseOfferings/" + term
    print(term)
    rawHTML = ""
    with open(term) as f:
        rawHTML = f.read()
    soup = BeautifulSoup(rawHTML, "html.parser")
    
    classTable = soup.find_all("table")[3]

    headerRow = classTable.find_all("tr")[1]
    headers = [child.text for child in headerRow.find_all("th")]

    otherRows = classTable.find_all("tr")[2:]

    allTableData = []
    for row in otherRows:
        data = row.find_all("td")
        if len(data) != len(headers):
            continue
        rowData = [child.text for child in data]
        
        allTableData.append(rowData)
    
    saveName = term[:-5] + ".csv"
    with open(saveName, "w") as f:
        f.write(",".join(headers) + "\n")
        for rowData in allTableData:
            f.write(",".join(rowData) + "\n")
    
    


# # dynamic schedule URL
# url = "https://pawnsstrng.usask.ca/ban/bwckschd.p_get_crse_unsec"
# 
# # boilerplate connection header. Necessary for connection to succeed
# 
# header = {
# "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
# "Accept-Encoding": "gzip, deflate, br",
# "Accept-Language": "en-US,en;q=0.9",
# "Cache-Control": "max-age=0",
# "Connection": "keep-alive",
# "Host": "pawss.usask.ca",
# "Sec-Fetch-Mode": "navigate",
# "Sec-Fetch-Site": "none",
# "Sec-Fetch-User": "?1",
# "Upgrade-Insecure-Requests": "1",
# "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
# }
# 
# def allClassesOfSubject(url, header, classType):
#     # what the form data will be in the POST request
#     postRequestData = "term_in=202001&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_ptrm=dummy&sel_attr=dummy&sel_subj=" + classType + "&sel_crse=&sel_title=&sel_schd=%25&sel_from_cred=&sel_to_cred=&sel_camp=%25&sel_ptrm=%25&sel_instr=%25&sel_sess=%25&sel_attr=%25&begin_hh=0&begin_mi=0&begin_ap=a&end_hh=0&end_mi=0&end_ap=a"
# 
#     requ = requests.post(url, data=postRequestData, headers=header)
# 
#     # contains the recieved page
#     rawHTML = requ.text
#     requ.close()
# 
#     print(rawHTML)
# 
#     # initialize the page to be parsed
#     soup = BeautifulSoup(rawHTML, "html.parser")
# 
#     # gets all tables in the page. The one that contains all the course offerings is the fourth one
#     tableOfClasses = soup.find_all("table")[3]
#     classList = tableOfClasses.find_all("tr")
# 
#     # get the listed headers
#     headers = classList[1]
#     headerList = [head.text for head in headers.find_all("th")]
# 
#     # store parsed class data as a list of lists
#     classes = [headerList]
#     for row in classList[2:]:
#         courseEntries = row.find_all("td")
# 
#         # if there aren't 17 entries in the row then the row doens't contain data for a class offering
#         if len(courseEntries) != 17:
#             continue
# 
#         offeringData = []
#         for data in courseEntries:
#             cleanedText = data.text.replace("\n", " ")
#             offeringData.append(cleanedText)
# 
#         classes.append(offeringData)
# 
#     with open("%s.csv" % classType, "w") as f:
#         for row in classes:
#             csvRow = ",".join(row) + "\n"
#             f.write(csvRow)
# 
# 
# 
# subjectCodes = []
# with open("./subjectCodes.txt") as f:
#     for line in f:
#         subjectCodes.append(line.strip())
# 
# # get course offering for every subject, and save them to their own csv file
# for classType in subjectCodes:
#     print(classType)
#     allClassesOfSubject(url, header, classType)
#     sleep(10)
#     try:
#         pass
#     except Exception as e: # there's lots of things that can go wrong so just notify and keep going when that happens
#         print("Got an error on class type: %s" % classType)
#         print(e)
#         print()
#     sys.exit()


# 
# header = {
# "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
# "Accept-Encoding": "gzip, deflate, br",
# "Accept-Language": "en-US,en;q=0.9",
# "Cache-Control": "max-age=0",
# "Connection": "keep-alive",
# "Host": "pawss.usask.ca",
# "Sec-Fetch-Mode": "navigate",
# "Sec-Fetch-Site": "none",
# "Sec-Fetch-User": "?1",
# "Upgrade-Insecure-Requests": "1",
# "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
# }
# 
# subjectCodes = []
# with open("./subjectCodes.txt") as f:
#     for line in f:
#         subjectCodes.append(line.strip())
# 
# for subject in subjectCodes:
#     print(subject)
#     url = "https://banner.usask.ca/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_subject=" + subject + "&txt_term=202001&pageOffset=0&pageMaxSize=1000"
#     print(url)
#     requ = requests.get(url, headers=header)
# 
#     # contains the recieved page
#     rawJSON = requ.text
#     requ.close()
# 
#     print(rawJSON)
# 
#     js = loads(rawJSON)
#     
#     courseData = js["data"]
#     
#     print(js)
#     sys.exit()
# 


