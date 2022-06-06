from os import listdir
from os import getcwd
from os.path import join

def convert12To24(time : str) -> str:
    isPm = time.split()[1] == "pm"
    min = time.split()[0].split(":")[1]
    hour = int(time.split()[0].split(":")[0])
    if hour == 12:
        if not isPm:
            hour -= 12
    else:
        if isPm:
            hour += 12
    return str(hour) + ":" + str(min)

def version1():
    dir = join(getcwd(), "courseOfferings/")
    cleanDir = join(getcwd(), "cleanOfferings/V1")
    allFiles = listdir(dir)
    for file in allFiles:
        print(file)
        if file[-4:] != ".csv":
            continue
        cleanOfferings = []
        with open(join(dir,file)) as f:
            header = f.readline()
            for line in f:
                splitLine = line.split(",")
                try:
                    if splitLine[1].isspace():
                        continue
                    time = splitLine[10]
                except:
                    continue

                if time != "TBA" and time != " ":
                    try:
                        startTime = time.split("-")[0]
                        endTime = time.split("-")[1].strip()
                        newStart = convert12To24(startTime)
                        newEnd = convert12To24(endTime)
                        newTime = newStart + "-" + newEnd
                        splitLine[10] = newTime
                    except:
                        continue
                cleanOfferings.append(splitLine)
        with open(join(cleanDir,file), "w") as f:
            f.write(header)
            for line in cleanOfferings:
                f.write(",".join(line))


def version2():
    monthDic = {
            "jan" : 1,
            "feb" : 2,
            "mar" : 3,
            "apr" : 4,
            "may" : 5,
            "jun" : 6,
            "jul" : 7,
            "aug" : 8,
            "sep" : 9,
            "oct" : 10,
            "nov" : 11,
            "dec" : 12
            }

    dir = join(getcwd(), "cleanOfferings/V1")
    cleanDir = join(getcwd(), "cleanOfferings/V2")
    courseOfferingData = []
    classData = []
    profData = []
    for file in listdir(dir):
        print(file)
        with open(join(dir,file)) as f:
            f.readline() # strip header
            for line in f:
                outputLine = []
                splitLine = line.strip().split(",")
                
                # there is a variable number of professors for a course. Strip out all but the first
                beforeProf = splitLine[0:13]
                afterProf = splitLine[-3:]
                firstProf = splitLine[13]

                stripLine = beforeProf + [firstProf] + afterProf

                # calculate start/end date
                date = stripLine[14]
                startDate = date[:6].lower()
                endDate = date[6:].lower()
                year = file[:4]
                

                # if the class isn't in in the system yet then add it
                courseNum = stripLine[3]
                if courseNum[-1] == "*":
                    courseNum = courseNum[:-1]
                classInfo = (stripLine[2], courseNum)
                if not classInfo in classData:
                    classData.append(classInfo)

                # if the prof isn't in the system yet then add them
                prof = stripLine[13]
                if prof != "TBA":
                    firstName = prof.split()[0]
                    lastName = prof.split()[-2]
                else:
                    firstName = "TBA"
                    lastName = "TBA"
                
                profName = (firstName, lastName)
                if not profName in profData:
                    profData.append(profName)

                # data in the order it should go in the database
                crn = stripLine[1]
                professorId = profData.index(profName)
                location = stripLine[15]
                if location == "NA NO_ROOM":
                    location = "TBA"
                days = stripLine[9]
                startDate = str(year) + "-" + str(monthDic[startDate[-3:]]) + "-" + str(startDate[:2])
                endDate = str(year) + "-" + str(monthDic[endDate[-3:]]) + "-" + str(endDate[:2])
                if stripLine[10] != "TBA":
                    startTime = stripLine[10].split("-")[0]
                    endTime = stripLine[10].split("-")[1]
                else:
                    startTime = "TBA"
                    endTime = "TBA"
                courseId = classData.index(classInfo)
                term = file.split("/")[-1][:-4]
                
                courseOfferingData.append([crn, professorId, location, days, startDate, endDate, startTime, endTime, courseId, term])

    with open(join(cleanDir, "professors.csv"), "w") as f:
        f.write("firstname,lastname\n")
        for prof in profData:
            f.write(prof[0] + "," + prof[1] + "\n")
    
    with open(join(cleanDir, "courses.csv"), "w") as f:
        f.write("subject, course_num\n")
        for clas in classData:
            f.write(clas[0] + "," + clas[1] + "\n")

    with open(join(cleanDir, "classes.csv"), "w") as f:
        f.write("crn,profId,location,days,start_date,end_date,start_time,end_time,course,term\n")
        for offering in courseOfferingData:
            offering = [str(x) for x in offering]
            f.write(",".join(offering) + "\n")


version2()
