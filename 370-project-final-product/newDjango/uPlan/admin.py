from django.contrib import admin
from .models import Professor, Course, Classes, Program

admin.site.register(Professor)
admin.site.register(Course)
admin.site.register(Classes)
admin.site.register(Program)
