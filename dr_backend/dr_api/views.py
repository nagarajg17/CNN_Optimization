from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render
from dr_api.models import Users
from dr_api.serializer import UserSerializer

class UserApi(APIView):
	def get(self, request):
		
		if request.query_params.get('id'):
			user_obj = Users.objects.get(id=request.query_params.get('id'))
			serial = UserSerializer(user_obj)
			return Response(serial.data)
		user_obj = Users.objects.all()
		serial = UserSerializer(user_obj, many=True)
		return Response(serial.data)
	def post(self, request):
		# import ipdb;ipdb.set_trace()
		serial = UserSerializer(data=request.data)
		if serial.is_valid():
			serial.save()
			return Response(serial.data)
		# else:
		# 	return Response(serial.errors)
	def put(self, request):
		id = request.data.get('id')
		user_obj = Users.objects.get(id=id)
		serial = UserSerializer(user_obj, data=request.data)
		if serial.is_valid():
			serial.save()
			return Response(serial.data)
		else:
			return Response(serial.errors)


# Create your views here.
