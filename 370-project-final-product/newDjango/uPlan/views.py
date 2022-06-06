# from django.shortcuts import render
from django.http import JsonResponse
from uPlan.models import Professor, Course, Classes, Program
from json import loads

# Documentation on how to do database queries with django: https://docs.djangoproject.com/en/3.0/topics/db/queries/


def classes(request):
    """ This is the view for the class searcher API.
        The requester specifies subject code, class name, days class is on, name of professor, and term it's in.
        It returns a json response of a database request with the given parameters with a json
    """
    requestDict = request.GET
    sub = requestDict["Subject"]
    classNum = requestDict["ClassNum"]
    days = requestDict["Days"]
    prof = requestDict["ProfName"]
    term = requestDict["Term"]

    if "Max" not in requestDict:
        max = 100
    elif requestDict["Max"] == "":
        max = False
    else:
        max = int(requestDict["Max"])

    result = Classes.objects.all()

    # TODO for subject make it so you can do either a 4 letter code or the full name

    if sub != "":
        result = result.filter(course__subject__icontains=sub)

    # TODO for days make it more robust then checking characters

    # Note if someone searches for MWF then results for MTWRF will show up
    if days != "":
        for char in days:
            result = result.filter(days__icontains=char)

    # prof will need to be one of their first name or last name
    if prof != "":
        # get the professor id and filter based on either first name or last name
        result = result.filter(prof_field__first_name__icontains=prof) | result.filter(prof_field__last_name__icontains=prof)

    # If a term is supplied filter by the term
    if term != "":
        result = result.filter(term__iexact=term)

    if classNum != "":
        result = result.filter(course__course_num__iexact=classNum)

    if max is not False:
        result = result[:max]

    desiredFields = ["crn_field", "location", "days", "start_date", "end_date", "start_time", "end_time", "term", "prof_field_id"]

    returnList = []
    for res in result:
        resultDict = {}
        resParams = res.__dict__
        for key in desiredFields:
            if key[0] != "_":
                resultDict[key] = resParams[key]

        prof = Professor.objects.get(pk=resParams["prof_field_id"])

        profName = prof.first_name + " " + prof.last_name
        resultDict["professor"] = profName

        course = Course.objects.get(pk=resParams["course_id"])
        courseString = course.subject + str(course.course_num)
        resultDict["class"] = courseString

        returnList.append(resultDict)

    response = JsonResponse({"result": returnList})
    response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    return response


def allProgramResponse(request):
    fullList = []
    for prog in Program.objects.all():
        fullList.append(prog.degree)
    return JsonResponse({"result": fullList})


def programSearchResponse(request):
    response = Program.objects.all().filter(degree__icontains=request["program"])
    if len(response) == 0:
        responseDict = {"result": []}
    else:
        programData = loads(response[0].rawJson)
        responseDict = {"result": programData}
    return JsonResponse(responseDict)


def programs(request):
    """ This is the view for the program searcher.
        The requester specifies the degree that the person wants to take, and makes a database query based on that
        It returns a json describing the specified program
    """
    request = request.GET
    response = None
    if "program" not in request:
        response = allProgramResponse(request)
    elif request["program"] == "":
        response = allProgramResponse(request)
    else:
        response = programSearchResponse(request)

    response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    return response

