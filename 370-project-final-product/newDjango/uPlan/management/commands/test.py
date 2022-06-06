from uPlan.models import Classes, Course, Professor, Program
from django.core.management.base import BaseCommand

CLASSESEXPECTED = 15217
COURSESEXPECTED = 3346
PROFSEXPECTED = 1942
PROGRAMSEXPECTED = 236


def databaseCompleteness():
    allOkay = True
    failedData = []

    # first check if there's the correct number of entries in the database
    classesActual = Classes.objects.all().count()
    if classesActual != CLASSESEXPECTED:
        allOkay = False
        failedData.append("The actual number of classes in the database does not match the expected number of classes. We expected: %i but got %i" % (classesActual, CLASSESEXPECTED))

    coursesActual = Course.objects.all().count()
    if coursesActual != COURSESEXPECTED:
        allOkay = False
        failedData.append("The actual number of courses in the database does not match the expected number of courses. We expected: %i but got %i" % (coursesActual, COURSESEXPECTED))

    profsActual = Professor.objects.all().count()
    if profsActual != PROFSEXPECTED:
        allOkay = False
        failedData.append("The actual number of profs in the database does not match the expected number of profs. We expected: %i but got %i" % (profsActual, PROFSEXPECTED))

    programsActual = Program.objects.all().count()
    if programsActual != PROGRAMSEXPECTED:
        allOkay = False
        failedData.append("The actual number of programs in the database does not match the expected number of programs. We expected: %i but got %i" % (programsActual, PROGRAMSEXPECTED))

    # now we check for duplicates in all the tables
    # Classes table
    fullList = []
    for cla in Classes.objects.all():
        fullList.append((cla.crn_field, cla.term))
    uniquesList = list(set(fullList))

    if len(uniquesList) != len(fullList):
        allOkay = False
        failedData.append("There are duplicate classes in the Classes table")
        for tup in fullList:
            if fullList.count(tup) != 1:
                print(tup, fullList.count(tup))

    # Course table
    fullList = []
    for course in Course.objects.all():
        fullList.append((course.subject, course.course_num))
    uniquesList = list(set(fullList))
    
    if len(uniquesList) != len(fullList):
        allOkay = False
        failedData.append("There are duplicate courses in the Course table")

    # Professor table
    fullList = []
    for prof in Professor.objects.all():
        fullList.append((prof.first_name, prof.last_name))
    uniquesList = list(set(fullList))

    if len(uniquesList) != len(fullList):
        allOkay = False
        failedData.append("There are duplicate professors in the Professor table")

    # Program table
    fullList = []
    for prog in Program.objects.all():
        fullList.append(prog.degree)
    uniquesList = list(set(fullList))
    
    if len(uniquesList) != len(fullList):
        allOkay = False
        failedData.append("There are duplicate programs in the Program table")

    # now we check to see if the database contains a few select items
    crns = [84490, 23508, 85642, 87909, 40304, 60037]
    terms = ["2019fall", "2020winter", "2018fall", "2019fall", "2018spring", "2019summer"]
    for crn, term in zip(crns, terms):
        result = Classes.objects.all().filter(crn_field=crn).filter(term=term)
        if result.count() != 1:
            allOkay = False
            failedData.append("In term: %s, the class with crn: %i appears %i times when it should only appear once"
                              % (term, crn, result.count()))

    if allOkay:
        print("The database is complete")
    else:
        print("Got the following errors when checking the database validity")
        for error in failedData:
            print("\t" + error)

    return failedData


class Command(BaseCommand):
    def handle(self, *args, **options):
        failedCases = []
        print("Checking to see if the database is complete")
        fails = databaseCompleteness()
        failedCases.extend(fails)
