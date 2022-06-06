import requests
from json import loads

allOkay = True
fails = []

def checkNonEmpty(url, paramName, allOkay, fails):
    try:
        requ = requests.get(url)
        result = loads(requ.text)["result"]
        if len(result) == 0:
            allOkay = False
            fails.append("Did not get any results when the %s parameter is non-empty" % paramName)
    except Exception as e:
        allOkay = False
        fails.append("Got error: %s when trying to access website: %s" % (str(e), url))

    return allOkay


#########################
# Class Checking ########
#########################
# make sure the requests return SOMETHING when each field has a parameter
url = "http://localhost:8000/api/class/?Subject=MATH&ClassNum=&Days=&ProfName=&Term="
allOkay = checkNonEmpty(url, "Subject", allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=&ClassNum=140&Days=&ProfName=&Term="
allOkay = checkNonEmpty(url, "ClassNum", allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=&ClassNum=&Days=TR&ProfName=&Term="
allOkay = checkNonEmpty(url, "Days", allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=&ClassNum=&Days=&ProfName=Long&Term="
allOkay = checkNonEmpty(url, "ProfName", allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=&ClassNum=&Days=&ProfName=&Term=2019summer"
allOkay = checkNonEmpty(url, "Term", allOkay, fails)

#########################
# Program Checking ######
#########################

#Testing allProgramResponse to see if it's nonempty
url = "http://localhost:8000/api/"
allOkay = checkNonEmpty(url, "AllProgramResponses", allOkay, fails)

url = "http://localhost:8000/api/program/"
allOkay = checkNonEmpty(url, "AllProgramResponses", allOkay, fails)

#make sure each request returns anything when each field has a parameter
url = "http://localhost:8000/api/program/?program=ba-3-arch-anth"
allOkay = checkNonEmpty(url, "Search By Degree", allOkay, fails)

if allOkay:
    print("All API requests came back as expected")
else:
    print("In testing the API the following errors occurred")
    for err in fails:
        print("\t" + err)
