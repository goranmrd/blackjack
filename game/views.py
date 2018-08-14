from django.views.generic import TemplateView
from django.shortcuts import render

def Home(request):
    return render(request, 'index.html')

class ThanksPage(TemplateView):
    template_name = 'thanks.html'