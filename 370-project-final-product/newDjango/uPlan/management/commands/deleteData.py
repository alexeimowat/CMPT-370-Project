from uPlan.models import Classes, Course, Professor, Program
from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    def handle(self, *args, **options):
        Classes.objects.all().delete()
        Course.objects.all().delete()
        Professor.objects.all().delete()
        Program.objects.all().delete()
