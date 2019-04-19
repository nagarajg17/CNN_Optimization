from django.contrib import admin
from django.urls import path,include
from cnnapi import views

urlpatterns = [
    path('predict/', views.CNNApi.as_view(), name='users')
]