from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import Gamer, IoTInformation, Trainer, Training


class BaseUserSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=100)
    age = serializers.IntegerField()


class IdSerializer(serializers.Serializer):
    id = serializers.IntegerField()


class IoTInformationUploadSerialization(serializers.Serializer):
    heart_rate = serializers.IntegerField()


class GamerSerializer(ModelSerializer):
    class Meta:
        model = Gamer
        fields = "__all__"


class TrainerSerializer(ModelSerializer):
    class Meta:
        model = Trainer
        fields = "__all__"


class TrainingSerializer(ModelSerializer):
    class Meta:
        model = Training
        exclude = ["gamers"]


class IoTInformationSerializer(ModelSerializer):
    class Meta:
        model = IoTInformation
        fields = "__all__"
