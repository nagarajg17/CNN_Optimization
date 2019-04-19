from django.contrib import admin
from django.urls import path,include
from dr_api import views

urlpatterns = [
    path('users/', views.UserApi.as_view(), name='users')
]