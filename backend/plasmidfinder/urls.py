# plasmidfinder/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('sample', views.sample_api, name='sample_api'),
    path('test', views.plasmidfinder_test, name='plasmidfinder_test'),
    path('driver', views.plasmidfinder_driver, name='plasmidfinder_driver')  
]