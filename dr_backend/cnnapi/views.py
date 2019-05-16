from django.shortcuts import render
from dr_api.models import Users
from rest_framework.views import APIView
from rest_framework.response import Response
from cnnapi.test import predict
from cnnapi.CNNSerializer import CNNSerializer
import math
# Create your views here.
class CNNApi(APIView):

	def get(self, request):
		
		obj = Users.objects.all()
		ser = CNNSerializer(obj,many=True)
		left_eye = ser.data[0]['left_eye']
		result = convo(left_eye)
		return Response(result)

	def post(self,request):
		# import ipdb;ipdb.set_trace()
		message='Fail'
		model_path_vggnet = 'C:/Users/HarishChandra/Documents/FinalYearProject/dr_backend/cnnapi/oversample_model_train005_0_1427_512_100_epochs.h5'
		model_path_incpnet = 'C:/Users/HarishChandra/Documents/FinalYearProject/dr_backend/cnnapi/inceptionv3_train.h5'
		img_left_path = 'C:/Users/HarishChandra/Documents/FinalYearProject/dr_backend/cnnapi/images/'+request.data['left_eye'].name
		img_dir = 'C:/Users/HarishChandra/Documents/FinalYearProject/dr_backend/cnnapi/images/'
		new_file = open(img_left_path,'wb+')
		for chunk in request.data['left_eye'].chunks():
			new_file.write(chunk)
		message='Success'
		# testing_left = predict(img_left_dir,0,1,model_path_vggnet,model_path_incpnet)
		left_eye_result=''
		left_eye_symptoms=''
		new_file.close()
		img_right_path = 'C:/Users/HarishChandra/Documents/FinalYearProject/dr_backend/cnnapi/images/'+request.data['right_eye'].name
		new_file1 = open(img_right_path,'wb+')
		for chunk in request.data['right_eye'].chunks():
			new_file1.write(chunk)
		message='Success'
		testing = predict(img_dir,0,2,model_path_vggnet,model_path_incpnet)
		# import ipdb;ipdb.set_trace()
		right_eye_result=''
		right_eye_symptoms=''
		new_file1.close()
		if testing[0][0]==0:
			left_eye_result='Normal'
			left_eye_symptoms='Healthy Eye'
		elif testing[0][0]==1:
			left_eye_result='Mild'
			left_eye_symptoms='Small areas of balloon-like swelling in the microaneurysms'
		elif testing[0][0]==2:
			left_eye_result='Moderate'
			left_eye_symptoms='Swelling and Distortion in the retinal blood vessels'
		elif testing[0][0]==3:
			left_eye_result='Severe'
			left_eye_symptoms='Blood vessels are blocked, blood supply to areas of the retina are deprived'
		elif testing[0][0]==4:
			left_eye_result='Proliferative'
			left_eye_symptoms='Fragile blood vessels are fragile, likely to leak and bleed. May lead to permanent vision loss'
		if testing[0][1]==0:
			right_eye_result='Normal'
			right_eye_symptoms='Healthy Eye'
		elif testing[0][1]==1:
			right_eye_result='Mild'
			right_eye_symptoms='Small areas of balloon-like swelling in the microaneurysms'
		elif testing[0][1]==2:
			right_eye_result='Moderate'
			right_eye_symptoms='Swelling and Distortion in the retinal blood vessels'
		elif testing[0][1]==3:
			right_eye_result='Severe'
			right_eye_symptoms='Blood vessels are blocked, blood supply to areas of the retina are deprived'
		elif testing[0][1]==4:
			right_eye_result='Proliferative'
			right_eye_symptoms='Fragile blood vessels are fragile, likely to leak and bleed. May lead to permanent vision loss'
		return Response({'left_eye_result':left_eye_result,'right_eye_result':right_eye_result,
						 'left_eye_symptoms':left_eye_symptoms, 'right_eye_symptoms':right_eye_symptoms,
						 'left_eye_confidence':str(math.ceil(testing[1][0]*100))+"%", 'right_eye_confidence':str(math.ceil(testing[1][1]*100))+"%"})
