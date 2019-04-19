from rest_framework import serializers
from dr_api.models import Users

class CNNSerializer(serializers.ModelSerializer):
	class Meta:
		model = Users
		fields = '__all__'