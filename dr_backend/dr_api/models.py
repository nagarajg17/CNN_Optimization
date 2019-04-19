from django.db import models

# Create your models here.
class Users(models.Model):
	name=models.CharField(max_length=20)
	gender=models.CharField(max_length=10)
	age=models.CharField(max_length=10)