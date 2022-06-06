from django.urls import path
from . import views

urlpatterns = [
    path("class/", views.classes, name="classes"),
    path("program/", views.programs, name="programs"),
]
