import requests
from typing import List, Dict
from time import sleep
from bs4 import BeautifulSoup
from json import dumps


def collectSubPrograms(url: str) -> List[str]:
    """ Given a url to a page to the program listing for a course (say computer science) return all the urls to subprograms (e.g. Honours, 4 year, 3 year, etc.)
    """
    # request the page and parse it
    requ = requests.get(url)
    rawHTML = requ.text
    requ.close()
    soup = BeautifulSoup(rawHTML, "html.parser")

    # get to the part of the page with links to the sub programs
    subProgramSection = soup.find_all("section")[1]
    subProgramList = subProgramSection.find("ul")
    subPrograms = []
    for program in subProgramList.find_all("a", href=True):
        subPrograms.append(url[:-9] + program["href"])
    return subPrograms


def analyzeParagraphBlock(contentBlock: BeautifulSoup) -> Dict[str, str]:
    """ Takes in a block with a paragraph and a div out of a programs page, and analyzes it for use in getClassesInProgram
    """
    
    number = 0
    try:
        par = contentBlock.find("p").text
        # want to find the number in this paragraph
        # it will give us the number of courses out of this section
        for word in par.split():
            if word.isdigit():
                number = int(word)
    except Exception:
        pass  # there's no paragraph to be found meaning that we should take all of them

    numberOfClasses = number // 3
    
    # now want to find the course options for this
    try:
        classListRaw = contentBlock.find_all("ul")[0]
        classList = []
        for classEntry in classListRaw.find_all("li"):
            className = classEntry.text.strip()
            classList.append(className)
    except Exception:
        classListRaw = contentBlock.find_all("p")[1].text
        classList = classListRaw.split("•")
        classList = [x.strip() for x in classList if x != ""]

    otherInfo = []
    for otherParagraphs in contentBlock.find_all("p")[2:]:
        otherInfo.append(otherParagraphs.text)

    if numberOfClasses == 0:
        numberOfClasses = len(classList)

    returnDict = {"numberOf": numberOfClasses,
                  "classes": classList,
                  "info": otherInfo}
    return returnDict


def analyzeDivBlock(contentBlock: BeautifulSoup) -> Dict[str, str]:
    classListRaw = contentBlock.find_all("ul")[0]
    classList = []
    for classEntry in classListRaw.find_all("li"):
        classList.append(classEntry.text.strip())

    if len(contentBlock.find_all("ul")) == 2:
        otherInfoRaw = contentBlock.find_all("ul")[1]
        otherInfo = []
        for infoLine in otherInfoRaw.find_all("li"):
            otherInfo.append(infoLine.text)
    else:
        otherInfo = []

    returnDict = {"numberOf": len(classList),
                  "classes": classList,
                  "info": otherInfo}
    return returnDict


def sectionOneData(section: BeautifulSoup) -> Dict[str, List[Dict[str, str]]]:
    sectionName = section.find("h1")
    sectionName = "other" if sectionName is None else sectionName.text.strip()

    optionList = []
    for subsection in section.find_all("div"):
        specialtyOptions = analyzeParagraphBlock(subsection)
        optionList.append(specialtyOptions)

    return {"Section Type": sectionName,
            "Option List": optionList}


def analyzeSectionTwoBlock(section: BeautifulSoup) -> Dict[str, str]:
    try:
        par = section.find("p").text
        # want to find the number in this paragraph
        # it will give us the number of courses out of this section
        for word in par.split():
            if word.isdigit():
                number = int(word)
                break
    except Exception:
        number = 0

    numberOfClasses = number // 3

    classList = []
    for li in section.find_all("li"):
        classList.append(li.text)

    if number == 0:
        numberOfClasses = len(classList)

    return {"numberOf": numberOfClasses,
            "classes": classList,
            "info": ""}


def sectionTwoData(section: BeautifulSoup) -> Dict[str, List[Dict[str, str]]]:
    sectionName = section.find("h1")
    sectionName = "other" if sectionName is None else sectionName.text.strip()

    optionList = analyzeSectionTwoBlock(section)
    return {"Section Type": sectionName,
            "Option List": [optionList]}


def sectionThreeData(section: BeautifulSoup) -> Dict[str, List[Dict[str, str]]]:
    sectionName = section.find("h1")
    sectionName = "other" if sectionName is None else sectionName.text.strip()

    optionList = analyzeSectionTwoBlock(section)
    return {"Section Type": sectionName,
            "Option List": [optionList]}


def getNumFromLine(line: str) -> int:
    number = 0
    for word in line.split():
        if word.isdigit():
            number = int(word)
            break
    return number


def analyzeSectionFour(section: BeautifulSoup) -> Dict[str, str]:
    relevantTags = section.find_all(["ul", "p"])

    fullClassList = []  # List[Dict[str, class info]]
    # this is kind of like a finite automata interestingly
    # these variables describe what tag was read last
    readUl = False
    number = 0
    numberOfClasses = 0
    info = []
    classList = []
    for tag in relevantTags:
        if tag.name == "p":
            if tag.find("ul") is not None:
                continue

            if readUl:  # if the tag before this one was a ul then we're starting a new section and we can finish off the old one
                if numberOfClasses == 0:
                    numberOfClasses = len(classList)

                fullClassList.append({
                    "numberOf": numberOfClasses,
                    "classes": classList,
                    "info": info
                })
                number = 0
                numberOfClasses = 0
                classList = []
                info = []

            if number == 0 or number > 100:  # sometimes there are multiple paragraphs describing a list of classes. This will handle that
                number = getNumFromLine(tag.text)
            numberOfClasses = number / 3
            readUl = False
        elif tag.name == "ul":
            if readUl:
                for li in tag.find_all("li"):
                    info.append(li.text)
            else:
                for li in tag.find_all("li"):
                    classList.append(li.text)

            readUl = True

    if classList != []:
        if numberOfClasses == 0:
            numberOfClasses = len(classList)
        fullClassList.append({
            "numberOf": numberOfClasses,
            "classes": classList,
            "info": info
        })

    return fullClassList


def sectionFourData(section: BeautifulSoup) -> Dict[str, List[Dict[str, str]]]:
    sectionName = section.find("h1")
    sectionName = "other" if sectionName is None else sectionName.text.strip()

    optionList = analyzeSectionFour(section)
    return {"Section Type": sectionName,
            "Option List": optionList}


def sectionFiveData(section: BeautifulSoup) -> Dict[str, List[Dict[str, str]]]:
    sectionName = section.find("h1")
    sectionName = "other" if sectionName is None else sectionName.text.strip()

    transformation = str.maketrans("(", " ")
    translatedName = sectionName.translate(transformation)
    num = getNumFromLine(translatedName)
    numberOfClasses = num / 3
    
    optionList = {
        "numberOf": numberOfClasses,
        "classes": "any",
        "info": []
    }

    return {"Section Type": sectionName,
            "Option List": [optionList]}


def getClassesInMinor(url: str) -> List[Dict[str, str]]:
    requ = requests.get(url)
    rawHTML = requ.text
    requ.close()
    soup = BeautifulSoup(rawHTML, "html.parser")

    optionList = []
    sections = soup.find_all("section")

    lastNamedSection = ""  # some section id's will just be integers which don't give any information. In that case we go off of the most recent named section
    for sec in sections:
        appendValue = None
        if len(sec.get("id")) != 1:
            lastNamedSection = sec.get("id")

        if "Requirements" in lastNamedSection:
            appendValue = sectionFourData(sec)
        # if the current id is an integer then fold the current data into the most recent entry
        if len(sec.get("id")) == 1 and len(optionList) != 0 and appendValue is not None:
            prevOptionList = optionList[-1]["Option List"]
            currentOptionList = appendValue["Option List"]
            prevOptionList.extend(currentOptionList)
        elif appendValue is not None:
            optionList.append(appendValue)

    if optionList == [] and "minor" in url:  # if no options are provided then you can take any classes that are in the subject
        optionList = [{'Section Type': 'Requirements (24 credit units)',
                       'Option List': [{"numberOf": 6, "classes": "any from minor subject", "info": []}]}]

    return optionList


def getClassesInProgram(url: str) -> List[Dict[str, str]]:
    """ Takes in a url to a program.
        Returns a list of dictionaries.
        The keys to the dictionary are the strings "numberOf", "classes", "info"
        The value of "numberOf" is the number of courses one must take out of a class type
        The value of "classes" is a list of classes that are in this class type.
            If there are open electives this will be a string saying "any"
        The value of "info" is a list of any other information regarding this block of classes
    """

    requ = requests.get(url)
    rawHTML = requ.text
    requ.close()
    soup = BeautifulSoup(rawHTML, "html.parser")

    optionList = []
    sections = soup.find_all("section")

    lastNamedSection = ""  # some section id's will just be integers which don't give any information. In that case we go off of the most recent named section
    for sec in sections:
        appendValue = None
        if len(sec.get("id")) != 1:
            lastNamedSection = sec.get("id")

        if "CollegeRequirement" in lastNamedSection:
            appendValue = sectionOneData(sec)

        if "BreadthRequirement" in lastNamedSection:
            appendValue = sectionTwoData(sec)

        if "CognateRequirement" in lastNamedSection:
            appendValue = sectionThreeData(sec)

        if "MajorRequirement" in lastNamedSection:
            appendValue = sectionFourData(sec)

        if "ElectivesRequirement" in lastNamedSection:
            appendValue = sectionFiveData(sec)

        # if the current id is an integer then fold the current data into the most recent entry
        if len(sec.get("id")) == 1 and len(optionList) != 0 and appendValue is not None:
            prevOptionList = optionList[-1]["Option List"]
            currentOptionList = appendValue["Option List"]
            prevOptionList.extend(currentOptionList)
        elif appendValue is not None:
            optionList.append(appendValue)

    if len(optionList) == 0:  # if that didn't work then maybe the class is a minor
        optionList = getClassesInMinor(url)

    return optionList

# most of the below comment was just to get a bunch of URLs which is then saved to a file
# this was changed to just load the URLs from the file instead of taking forever to do this

# first step is to get the listing of all programs in arts and science

# # program listing URL
# url = "https://programs.usask.ca/arts-and-science/programs.php"
#
# # access the site and get it's HTML
# requ = requests.get(url)
#
# rawHTML = requ.text
# requ.close()
#
# # parse the HTML
# soup = BeautifulSoup(rawHTML, "html.parser")
#
# # there are two tables that hold the program list
# programList1 = soup.find_all("ul")[4]
# programList2 = soup.find_all("ul")[5]
#
# allProgramURLs = []
# for program in programList1.find_all("a", href=True):
#     allProgramURLs.append(program["href"])
#
# for program in programList2.find_all("a", href=True):
#     allProgramURLs.append(program["href"])
#
# # convert URLs to be full URLs instead of partial URLs
# baseURL = "https://programs.usask.ca/arts-and-science/"
# allProgramURLs = [baseURL+url for url in allProgramURLs]
#
# # collects all subPrograms in arts and science
# subPrograms = []
# for url in allProgramURLs:
#     print(url)
#     try:
#         subPrograms.extend(collectSubPrograms(url))
#     except: # evidently there's a tag we expect will exist on that page, but instead it has decided to not exist
#         # the common case for this is when instead of a selection of programs there is instead a program itself. This is common with minors, and certificates
#         try:
#             subPrograms.append(url)
#         except Exception as e: # some other case that should be looked at by hand
#             print("got error with webpage:")
#             print("\t" + url)
#             print(e)
#             print()
#     sleep(5)
#
# with open("programURLs.txt", "w") as f:
#     # save to file in case something fails catestrophically
#     for url in subPrograms:
#         f.write(url + "\n")


subPrograms = []
with open("./programURLs.txt") as f:
    for line in f:
        subPrograms.append(line.strip())

errorURLs = []


def getPage(url):
    print(url)
    try:
        allClasses = getClassesInProgram(url)
    except Exception as e:
        errorURLs.append((url, e))
        allClasses = {}
    return allClasses

# subPrograms = ["https://programs.usask.ca/arts-and-science/biology/minor-biology.php"]


def getFilename(url):
    requ = requests.get(url)
    rawHTML = requ.text
    requ.close()
    soup = BeautifulSoup(rawHTML, "html.parser")
    try:
        fieldName = soup.find("h1", class_="uofs-page-title").text
        degreeType = soup.find("p", class_="lead").text
        return fieldName + " " + degreeType
    except Exception:
        print(url)
        return "failed"


for sub in subPrograms:
    pageJson = getPage(sub)
    fileName = getFilename(sub)

    if pageJson == {} or fileName == "failed":
        continue

    fileName = fileName.replace(" ", "_")
    with open("./programs/%s.json" % fileName, "w") as f:
        f.write(dumps(pageJson))
    sleep(5)

with open("programErrorPages.txt", "w") as f:
    for urlTuple in errorURLs:
        f.write(urlTuple[0] + "\n")
        f.write(str(urlTuple[1]) + "\n\n")
