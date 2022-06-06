import requests
"""
    This Module is a test suite that tests the ourput of the Programs API
"""
from json import loads

allOkay = True
fails = []

numberOfPrograms = 236


def checkNonEmpty(url, paramName, allOkay, fails):
    try:
        requ = requests.get(url)
        result = loads(requ.text)["result"]
        if len(result) == 0:
            allOkay = False
            fails.append("No results when %s paramter is not empty" % paramName)
    except Exception as e:
        allOkay = False
        fails.append("Got error: %s when trying to access site: %s" % (str(e), url))

    return allOkay


# Testing allProgramResponse to see if it's nonempty
url = "http://localhost:8000/api/program/"
allOkay = checkNonEmpty(url, "AllProgramResponses", allOkay, fails)

# make sure each request returns anything when each field has a parameter
url = "http://localhost:8000/api/program/?program=ba-3-arch-anth"
allOkay = checkNonEmpty(url, "Search By Degree", allOkay, fails)

url = "http://localhost:8000/api/program/?program=minor-toxicology"
allOkay = checkNonEmpty(url, "Search By Degree", allOkay, fails)

url = "http://localhost:8000/api/program/?program=ba-honours-philosophy"
allOkay = checkNonEmpty(url, "Search By Degree", allOkay, fails)

url = "http://localhost:8000/api/program/?program=ba-double-honours-political-studies-2"
allOkay = checkNonEmpty(url, "Search By Degree", allOkay, fails)

url = "http://localhost:8000/api/program/?program=bsc-double-hon-math-statistics-1-and-2"
allOkay = checkNonEmpty(url, "Search By Degree", allOkay, fails)


# Testing the Max parameter works as intended for Programs
def checkNumResponses(url, expectedNum, allOkay, fails):
    try:
        requ = requests.get(url)
        result = loads(requ.text)["result"]
        if len(result) != expectedNum:
            allOkay = False
            fails.append("When making request: %s got %i programs instead of the expected %i." % (url, len(result), expectedNum))
    except Exception as e:
        allOkay = False
        fails.append("Got error: %s when accessing: %s" % (str(e), url))
    return allOkay


# url = "http://localhost:8000/api/program/"
# allOkay = checkNumResponses(url, numberOfPrograms, allOkay, fails)

# url = "http://localhost:8000/api/program/Max=50"
# allOkay = checkNumResponses(url, 50, allOkay, fails)

# url = "http://localhost:8000/api/program/Max=100"
# allOkay = checkNumResponses(url, 100, allOkay, fails)


def checkMajorReq(url, progReq, section, allOkay, fails):
    """ Check if the major has a class required of it
    """

    try:
        requ = requests.get(url)
        result = loads(requ.text)["result"]
        if progReq not in result[section]:
            fails.append("%s not in request %s section %i" % (progReq, url, section))
    except Exception as e:
        allOkay = False
        fails.append("Got error %s while accessing %s" % (str(e), url))
    return allOkay


url = "http://localhost:8000/api/program/?program=ba-4-psychology"
allOkay = checkMajorReq(url, "PSY 120.3", 3, allOkay, fails)
allOkay = checkMajorReq(url, "ENG 112.3", 1, allOkay, fails)
allOkay = checkMajorReq(url, "PSY 347.3", 3, allOkay, fails)
allOkay = checkMajorReq(url, "ART 141.3", 2, allOkay, fails)
if allOkay:
    print("All Api requests return as with data")
else:
    print("Error: API requests:")
    for e in fails:
        print("\t"+e)
