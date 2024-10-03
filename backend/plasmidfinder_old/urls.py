from django.urls import path
from . import views

from haoma.utils.logging_config import configure_logger
logger = configure_logger(__name__)

urlpatterns = [
    path("", views.index, name="index"),
    path('test', views.plasmidfinder_test, name='plasmidfinder_test'),
    path('driver', views.plasmidfinder_driver, name='plasmidfinder_driver')    
]
