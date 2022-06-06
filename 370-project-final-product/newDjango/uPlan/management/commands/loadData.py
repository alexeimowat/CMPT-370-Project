from uPlan.models import Classes, Course, Professor, Program
from django.core.management.base import BaseCommand, CommandError
from os import listdir
from os.path import join

class Command(BaseCommand):
    def handle(self, *args, **options):
        # populate course offering table
        print("populating the programs table")
        programDirectory = "./data/programs"
        for file in listdir(programDirectory):
            fullFileName = join(programDirectory, file)
            with open(fullFileName) as f:
                rawJson = f.read()
            program = Program(
                degree = file[:-5], # just use the path with the .json stripped out
                rawJson = rawJson
            )
            program.save()


        # populate professor table
        print("populating the table of professors")
        allProfs = []
        with open("./data/professors.csv") as f:
            header = f.readline()
            for line in f:
                splitLine = line.strip().split(",")
                prof = Professor(first_name=splitLine[0], last_name=splitLine[1])
                prof.save()
                allProfs.append(prof)

        # populate course table
        print("populating the table of courses")
        allCourses = []
        with open("./data/courses.csv") as f:
            header = f.readline()
            for line in f:
                splitLine = line.strip().split(",")
                course = Course(subject = splitLine[0], course_num = int(splitLine[1]))
                course.save()
                allCourses.append(course)

        # populate classes table
        print("populating the table of classes")
        with open("./data/classes.csv") as f:
            header = f.readline()
            for line in f:
                splitLine = line.strip().split(",")
                if splitLine[6] == "TBA":
                    splitLine[6] = "00:00"
                    splitLine[7] = "00:00"
                
                course = Classes(
                    crn_field = int(splitLine[0]),
                    prof_field = allProfs[int(splitLine[1])],
                    location = splitLine[2],
                    days = splitLine[3],
                    start_date = splitLine[4],
                    end_date = splitLine[5],
                    start_time = splitLine[6],
                    end_time = splitLine[7],
                    course = allCourses[int(splitLine[8])],
                    term = splitLine[9]
                )
                course.save()

            


