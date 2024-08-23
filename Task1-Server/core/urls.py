from django.urls import path

from .views import (AddGamerToTrain, GetCurrentTraining, GetIoTData,
                    GetMyTrainings, GetStatisticFromSession,
                    GetStatisticPlotFromSession, IsTrainer, RegisterGamer,
                    RegisterTrainer, TrainingViewSet)

urlpatterns = [
    path(
        "trains/",
        TrainingViewSet.as_view({"get": "list", "post": "create"}),
        name="train",
    ),
    path("current_trains", GetCurrentTraining.as_view(), name="current_train"),
    path("trains/<int:pk>/add", AddGamerToTrain.as_view(), name="register_gamer"),
    path("trains/<int:pk>/end", GetStatisticFromSession.as_view(), name="iot"),
    path(
        "trains/<int:pk>/end/photo",
        GetStatisticPlotFromSession.as_view(),
        name="my_trainings",
    ),
    # path("me/<int:pk>", GetMe.as_view({"get": "retrieve"}), name="me"),
    path("me/is_trainer", IsTrainer.as_view(), name="is_trainer"),
    path("me/trainings", GetMyTrainings.as_view(), name="my_trainings"),
    path("trains/<int:pk>/iot", GetIoTData.as_view(), name="iot_data"),
    path("register/", RegisterGamer.as_view(), name="register_trainer"),
    path("trainer/register/", RegisterTrainer.as_view(), name="register"),
]
