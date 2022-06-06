""" This module is a test suite that tests the ouput of the classes API
"""

from json import loads
import requests

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

# now check if there's at least one when we specify pairs of parameters
url = "http://localhost:8000/api/class/?Subject=CMPT&ClassNum=140&Days=&ProfName=&Term="
allOkay = checkNonEmpty(url, "Subject, ClassNum", allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=CMPT&ClassNum=&Days=MWF&ProfName=&Term="
allOkay = checkNonEmpty(url, "Subject, Days", allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=MATH&ClassNum=&Days=&ProfName=Rayan&Term="
allOkay = checkNonEmpty(url, "Subject, ClassNum", allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=MATH&ClassNum=&Days=&ProfName=&Term=2020winter"
allOkay = checkNonEmpty(url, "Subject, Term", allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=&ClassNum=116&Days=MWF&ProfName=&Term="
allOkay = checkNonEmpty(url, "ClassNum, Days", allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=&ClassNum=277&Days=&ProfName=Rayan&Term="
allOkay = checkNonEmpty(url, "ClassNum, ProfName", allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=&ClassNum=277&Days=&ProfName=&Term=2020winter"
allOkay = checkNonEmpty(url, "ClassNum, Term", allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=&ClassNum=&Days=MWF&ProfName=Long&Term="
allOkay = checkNonEmpty(url, "Days, ProfName", allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=&ClassNum=&Days=MWF&ProfName=&Term=2019fall"
allOkay = checkNonEmpty(url, "Days, Term", allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=&ClassNum=&Days=&ProfName=Patrick&Term=2019fall"
allOkay = checkNonEmpty(url, "ProfName, Term", allOkay, fails)


# now test if the Max parameter is working as intended
def checkNumResponses(url, expectedNum, allOkay, fails):
    try:
        requ = requests.get(url)
        result = loads(requ.text)["result"]
        if len(result) != expectedNum:
            allOkay = False
            fails.append("When making request: %s we got %i classes when we expected to get %i" % (url, len(result), expectedNum))
    except Exception as e:
        allOkay = False
        fails.append("Got error: %s when trying to access website: %s" % (str(e), url))

    return allOkay


url = "http://localhost:8000/api/class/?Subject=&ClassNum=&Days=&ProfName=&Term=2019fall"
allOkay = checkNonEmpty(url, 100, allOkay, fails)

url = "http://localhost:8000/api/class/?Subject=&ClassNum=&Days=&ProfName=&Term=2019fall&Max=50"
allOkay = checkNonEmpty(url, 50, allOkay, fails)


# now we pick a certain class, and see if every search that should include it actually includes it
def dictionaryIsSubset(subSet, superSet):
    """ For every key in subSet see if superSet has that key aswell as a matching value
        Effecitvely checks if the subset dictionary is a subset of the superSet dictionary
    """
    isSubset = True
    for key in subSet:
        if key not in superSet:
            isSubset = False
            break
        if subSet[key] != superSet[key]:
            isSubset = False
            break
    return isSubset


def checkIfIncludes(paramList, knownClass, allOkay, fails):
    """ Check if whether all the searches that knownClass ought to show up in actually contain knownClass
    """
    sub, num, days, prof, term = paramList
    # for every possible parameter either give the actual field or an empty string
    for subject in [sub, ""]:
        for number in [num, ""]:
            for day in [days, ""]:
                for profName in [prof, ""]:
                    for termName in [term, ""]:
                        # skip the step if everything is an empty string or if only the term is defined
                        if subject == "" and number == "" and day == "" and profName == "":
                            continue
                        url = "http://localhost:8000/api/class/?Subject=%s&ClassNum=%s&Days=%s&ProfName=%s&Term=%s&Max=" % (
                            subject, number, day, profName, termName)

                        try:
                            requ = requests.get(url)
                            result = loads(requ.text)["result"]
                        except Exception as e:
                            allOkay = False
                            fails.append("Got error: %s when trying to access website: %s" % (str(e), url))
                            continue

                        # check against all the results to see if the knownClass is one of them
                        showsUpInSearch = False
                        for resultDict in result:
                            if dictionaryIsSubset(knownClass, resultDict):
                                showsUpInSearch = True

                        if not showsUpInSearch:
                            allOkay = False
                            fails.append("The dict: %s did not show up in the query: %s" % (str(knownClass), url))

    return allOkay


params = ["MATH", "238", "TR", "Patrick", "2019fall"]
knownClass = {"professor": "George Patrick", "location": "ARTS 108", "days": "TR", "term": "2019fall", "class": "MATH238"}
allOkay = checkIfIncludes(params, knownClass, allOkay, fails)

params = ["CMPT", "140", "MWF", "long", "2019fall"]
knownClass = {"professor": "Jeffrey Long", "location": "PHYSIC 165", "days": "MWF", "term": "2019fall", "class": "CMPT140"}
allOkay = checkIfIncludes(params, knownClass, allOkay, fails)

params = ["MATH", "277", "MWF", "steve", "2020winter"]
knownClass = {"professor": "Steven Rayan", "days": "MWF", "term": "2020winter", "class": "MATH277"}
allOkay = checkIfIncludes(params, knownClass, allOkay, fails)


if allOkay:
    print("All API requests came back as expected")
else:
    print("In testing the API the following errors occurred")
    for err in fails:
        print("\t" + err)
