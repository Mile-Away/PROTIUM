from django.shortcuts import render

# Create your views here.
# views.py
from django.http import HttpResponse


def root_view(request):
    return HttpResponse("Error: 404 Not Found", status=404)
