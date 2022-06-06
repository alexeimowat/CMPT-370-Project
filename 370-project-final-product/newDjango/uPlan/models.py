# Create your models here.

from django.db import models


# Create your models here.
class Professor(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    def __str__(self):
        return self.first_name + " " + self.last_name


class Course(models.Model):
    subject = models.CharField(max_length=10)
    course_num = models.IntegerField(default=0)

    def __str__(self):
        return self.subject + str(self.course_num)


class Classes(models.Model):
    crn_field = models.IntegerField(default=0)
    prof_field = models.ForeignKey(Professor, on_delete=models.CASCADE)
    location = models.CharField(max_length=100)
    days = models.CharField(max_length=10)
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    term = models.CharField(max_length=50)

    def __str__(self):
        return "crn: " + str(self.crn_field) + " " + self.term


class Program(models.Model):
    degree = models.CharField(max_length=200)
    rawJson = models.CharField(max_length=15000)

    def __str__(self):
        return self.degree
