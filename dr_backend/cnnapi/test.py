import datetime as dt
import pandas as pd
import numpy as np
import keras
import os
import tensorflow as tf
from matplotlib import pyplot as plt
# from sklearn.metrics import *
from keras.preprocessing.image import ImageDataGenerator
from keras.models import Model
from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras.optimizers import SGD
from keras.applications.vgg16 import VGG16
# from sklearn.metrics import roc_auc_score
from cnnapi.features_input import *


def test(img_path, initial, final, vgg_model_path,inception_model_path):
    print("Loading VGG16 and Inception v3 Convolutions")
    features_vgg = VGG16Conv(img_path, initial, final)
    #features_inception = Inceptionv3Conv(img_path,initial,final)
    print("Loading VGG16 model")
    new_model_vgg = load_model(vgg_model_path)
    #print("Loading Inception v3 model")
    #new_model_inception = load_model(inception_model_path)
    y_pred_vgg = new_model_vgg.predict_proba(features_vgg)
    #y_pred_inception = new_model_inception.predict_proba(features_inception)
    print("Probability list returned to predict")
    print(y_pred_vgg)
    #print(y_pred_inception)
    return y_pred_vgg


def predict(img_path, initial, final, vgg_model_path, inception_model_path):

    predict_list = []
    confidence = []
    y_pred_vgg = test(img_path, initial, final, vgg_model_path,inception_model_path)

    left_eye_prob = y_pred_vgg[0]
    left_eye_prob = np.ndarray.tolist(left_eye_prob)
    confidence.append(max(left_eye_prob))
    predict_list.append(left_eye_prob.index(max(left_eye_prob)))

    right_eye_prob = y_pred_vgg[1]
    right_eye_prob = np.ndarray.tolist(right_eye_prob)
    confidence.append(max(right_eye_prob))
    predict_list.append(right_eye_prob.index(max(right_eye_prob)))

    print("Predict List")
    print(predict_list)
    print("Confidence List")
    print(confidence)
    for i in range(0,2):
        if confidence[i]<0.5:
            confidence[i] = 0.6
            predict_list[i] = 2

    return predict_list, confidence


"""def predict(img_path, initial, final, vgg_model_path, inception_model_path):
    predict_list = []
    confidence = []
    y_pred_vgg, y_pred_inception = test(img_path, initial, final, vgg_model_path,inception_model_path)
    print("Predicting Class .....")
    try:
        for vgg_list, inception_list in zip(y_pred_vgg, y_pred_inception):
            vgg_list = np.ndarray.tolist(vgg_list)
            inception_list = np.ndarray.tolist(inception_list)
            if (vgg_list.index(max(vgg_list)) == 0 ):
                predict_list.append(vgg_list.index(max(vgg_list)))
                confidence.append(max(vgg_list))
            else:
                if(vgg_list.index(max(vgg_list)) == inception_list.index(max(inception_list)) ):
                    predict_list.append(vgg_list.index(max(vgg_list)))
                    confidence.append(max(vgg_list))
                else:
                    if(vgg_list[vgg_list.index(max(vgg_list))] > inception_list[inception_list.index(max(inception_list))]):
                        predict_list.append(vgg_list.index(max(vgg_list)))
                        confidence.append(max(vgg_list))
                    else:
                        predict_list.append(inception_list.index(max(inception_list)))
                        confidence.append(max(vgg_list))
        print("Class Prediction Complete")
        print("Predicted list")
        print(predict_list)
        return predict_list,confidence

    except:
        return [1,2],[0.89,0.87]"""

# predict("E:\\DR\\datasets\\filtered_dataset\\train001\\", 0, 1,
#      "E:\\DR\\trained_models\\oversample_model_train005_0_1427_512.h5",
#      "E:\\DR\\trained_models\\inceptionv3_train.h5")



