import random
from datetime import datetime, timedelta

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from django.contrib.auth.models import User
from rest_framework import generics, response, views, viewsets
from rest_framework.response import Response

from .models import Gamer, IoTInformation, Trainer, Training
from .permisions import IsTrainerOrReadOnly
from .serializers import (BaseUserSerializer, GamerSerializer, IdSerializer,
                          IoTInformationUploadSerialization,
                          TrainingSerializer)


# Generics
class IoTInformationListView(generics.ListAPIView):
    queryset = IoTInformation.objects.all()
    serializer_class = GamerSerializer


# ModelViewSets


class GamerViewSet(viewsets.ModelViewSet):
    queryset = Gamer.objects.all()
    serializer_class = GamerSerializer


class GetMyTrainings(views.APIView):
    def get(self, request):
        gamer = Gamer.objects.get(user=request.user)
        if not gamer:
            return Response({"message": "You are not a gamer"}, status=400)
        trainings = Training.objects.filter(gamers=gamer)
        return Response([i.id for i in trainings], status=200)


class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    permission_classes = [IsTrainerOrReadOnly]

    def create(self, request):
        trainer = Trainer.objects.get(user=request.user)
        if not trainer:
            return Response({"message": "You are not a trainer"}, status=400)
        request.data["trainer"] = trainer.id
        training_serializer = TrainingSerializer(data=request.data)
        if not training_serializer.is_valid():
            return Response(training_serializer.errors, status=400)
        data = training_serializer.data
        training = Training.objects.create(
            trainer=trainer,
            duration=data["duration"],
            datetime=data["datetime"],
            description=data["description"],
        )
        training.save()
        return Response(TrainingSerializer(training).data, status=201)

    def get_queryset(self):
        return Training.objects.filter(datetime__gte=datetime.now())


# APIViews


class IsTrainer(views.APIView):
    def get(self, request):
        trainer = Trainer.objects.filter(user=request.user.id)
        print(trainer)
        if len(trainer) == 0:
            return Response(
                {"message": "You are not a trainer", "isTrainer": False}, status=400
            )
        return Response({"message": "You are a trainer", "isTrainer": True}, status=200)


class RegisterGamer(views.APIView):
    def post(self, request):
        user_serializer = BaseUserSerializer(data=request.data)
        if not user_serializer.is_valid():
            return response.Response(user_serializer.errors, status=400)
        data = user_serializer.data
        user = User.objects.create_user(
            username=data["email"],
            email=data["email"],
            password=data["password"],
        )
        gamer = Gamer.objects.create(
            name=data["name"],
            age=data["age"],
            user=user,
        )
        gamer.save()
        return response.Response(GamerSerializer(gamer).data, status=201)


class RegisterTrainer(views.APIView):
    def post(self, request):
        user_serializer = BaseUserSerializer(data=request.data)
        if not user_serializer.is_valid():
            return response.Response(user_serializer.errors, status=400)
        data = user_serializer.data
        user = User.objects.create_user(
            username=data["email"],
            email=data["email"],
            password=data["password"],
        )
        trainer = Trainer.objects.create(
            name=data["name"],
            age=data["age"],
            user=user,
        )
        trainer.save()
        return response.Response(GamerSerializer(trainer).data, status=201)


class AddGamerToTrain(views.APIView):
    def post(self, request, pk: int):
        id_serializer = IdSerializer(data=request.data)
        if id_serializer.is_valid():
            id = id_serializer.data["id"]
            gamer = Gamer.objects.get(pk=id)
        else:
            user = request.user.id
            gamer = Gamer.objects.get(user=user)

        training = Training.objects.get(pk=pk)

        training.gamers.add(gamer)
        training.save()

        return response.Response(TrainingSerializer(training).data, status=201)


class GetStatisticFromSession(views.APIView):
    def get(self, request, pk: int):
        training = Training.objects.get(pk=pk)
        gamers = IoTInformation.objects.filter(training=training)
        return response.Response(
            {"heard_rates": [i.heart_rate for i in gamers]}, status=200
        )


class GetStatisticPlotFromSession(views.APIView):
    def get(self, request, pk: int):
        training = Training.objects.get(pk=pk)
        gamers = IoTInformation.objects.filter(training=training)
        heard_rates = [i.heart_rate for i in gamers]
        plt.plot(heard_rates)
        random_name = random.randint(0, 100000)
        with open(f"static/plot{random_name}.png", "wb") as temp:
            plt.savefig(temp, format="png")
        return response.Response({"filename": f"plot{random_name}.png"}, status=200)


class GetIoTData(views.APIView):
    def post(self, request, pk: int):
        iot_serializer = IoTInformationUploadSerialization(data=request.data)
        if not iot_serializer.is_valid():
            return response.Response(iot_serializer.errors, status=400)
        training = Training.objects.get(pk=pk)
        gamer = Gamer.objects.get(user=request.user)
        iot = IoTInformation.objects.create(
            gamer=gamer,
            training=training,
            heart_rate=iot_serializer.data["heart_rate"],
        )
        iot.save()
        return Response({"message": "All good"}, status=201)


class GetCurrentTraining(views.APIView):
    def get(self, request):
        gamer = Gamer.objects.get(user=request.user)
        if not gamer:
            return Response({"message": "You are not a gamer"}, status=400)
        trainings = Training.objects.filter(
            gamers=gamer.id, datetime__gte=datetime.now()
        )
        for i in trainings:
            print(i.datetime + timedelta(seconds=i.duration))
            print(datetime.now() + timedelta(hours=3))
        trainings_list = [TrainingSerializer(i).data for i in trainings]
        print(trainings_list)

        return Response(trainings_list, status=200)
