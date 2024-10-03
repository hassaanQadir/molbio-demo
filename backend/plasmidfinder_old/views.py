from django.shortcuts import render
from haoma.utils.logging_config import configure_logger
logger = configure_logger(__name__)

# Create your views here.
from zipfile import ZipFile
from io import BytesIO
import asyncio
import json
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from decouple import config
from django.views.decorators.http import require_http_methods
from celery.result import AsyncResult
from .utilities import driver
from django.views.decorators.csrf import csrf_exempt

from django.http import JsonResponse


@require_http_methods(["GET", "POST"])
def index(request):
    if request.method == "POST":
        user_input = request.POST.get('pmid')
        
        multiple_agents_results_dictionary = asyncio.run(driver(user_input))
        plasmidfinder_agent_results_dictionary = multiple_agents_results_dictionary["plasmidfinder_agent_results_dictionary"]
        results_dictionary = plasmidfinder_agent_results_dictionary["duckduckgo_results_dict"]
        addgene_genbank = plasmidfinder_agent_results_dictionary["addgene_genbank"]
        final_output_string = plasmidfinder_agent_results_dictionary["final_output_string"]

        return render(request, 'plasmidfinder_results.html', {'results_dictionary': results_dictionary, 'addgene_genbank':addgene_genbank, 'final_output_string': final_output_string})
        
    return render(request, 'plasmidfinder_input_form.html')

@require_http_methods(["POST"])
def plasmidfinder_driver(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_input = data.get('pmid')

        multiple_agents_results_dictionary = driver(user_input)

        return JsonResponse(multiple_agents_results_dictionary)
    
@require_http_methods(["POST"])
def plasmidfinder_test(request):
    if request.method == "POST":
        print(f"plasmidfinder_test method was called with: {request}")
        # Return a JsonResponse with the results
        return JsonResponse({"message": "You accessed the plasmidfinder backend"})