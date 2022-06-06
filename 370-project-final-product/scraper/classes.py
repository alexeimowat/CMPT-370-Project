# The purpose of this file is to retreive information about classes and their prerequisites

import requests
from time import sleep
from bs4 import BeautifulSoup
from json import dumps
import sys

# make request
url = "https://catalogue.usask.ca/"

# we first want to retrieve all the subject codes 
classTypeList = []
with open("./subjectCodes.txt") as f:
    for line in f:
        classTypeList.append(line.strip())

# Dict[str, Dict[]]
# inner dict has keys of "fullName" "description" "prereq" "otherInfo"
allClasses = {}
for classType in classTypeList:
    newURL = url + "?subj_code=%s&cnum=" % classType
    requ = requests.get(newURL)
    print(newURL)
    rawHTML = requ.text
    requ.close()

    soup = BeautifulSoup(rawHTML, "html.parser")
    
    containerDiv = soup.find_all("div", class_="container-fluid")[1]

    # there are many children div (pretty much unmarked where they start)
    # to find where the classes are we iterate through the children till
    # we find a header
    foundHeader = False
    for child in containerDiv.contents:
        if not foundHeader:
            if child.name == "h3": # every div after this point will be a class
                foundHeader = True

        if child.name == "div" and foundHeader:
            fullClassName = child.find("h4").text.strip() # something like "ARBC 114.3: Beginning Arabic I"
            className = fullClassName.split()[0:2]
            number = className[-1][:-3]
            className = tuple(className[:-1]) # something like "ARBC 114.3"
            
            otherDivs = child.find_all("div")
            courseDescrptionRaw = otherDivs[0].text.strip()
            courseDescrption = " ".join(courseDescrptionRaw.split()) # trick to convert all contiguous blocks of white space to a single space
            prereqLine = [line for line in courseDescrptionRaw.split("\n") if "prereq" in line.lower()]
            processedPrereq = []
            if len(prereqLine) > 0:
                for line in prereqLine:
                    start = line.find("Prereq")
                    processedPrereq.append(line[start:])

            otherInfo = otherDivs[1].text
            otherInfo = " ".join(otherInfo.split())             
            returnDict = {"fullName" : fullClassName,
                          "description" : courseDescrption,
                          "prereq" : processedPrereq,
                          "otherInfo" : otherInfo}

            # figure out if it's a grad class
            gradClass = False
            if number.isdigit() and int(number) >= 500:
                gradClass = True

            if not gradClass: # ignore grad classes
                allClasses[className] = returnDict

    sleep(10)

with open("./allClassDescriptions.json", "w") as f:
    f.write(json.dumps(allClasses))
