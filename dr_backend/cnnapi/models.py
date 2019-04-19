from django.db import models
from dr_api.models import Users
# Create your models here.
class UserImage(models.Model):
	left_eye = models.FileField(max_length=30)
	right_eye = models.FileField(max_length=30)
	user = models.ForeignKey(Users, on_delete=models.CASCADE)