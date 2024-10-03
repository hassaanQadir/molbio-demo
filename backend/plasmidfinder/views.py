# plasmidfinder/views.py
from django.shortcuts import render

def home(request):
    reversed_text = ''
    if request.method == 'POST':
        input_text = request.POST.get('input_text', '')
        reversed_text = input_text[::-1]  # Reverse the input text
    return render(request, 'plasmidfinder/home.html', {'reversed_text': reversed_text})

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def sample_api(request):
    data = {
        'message': 'Hello from Django!'
    }
    return Response(data)
