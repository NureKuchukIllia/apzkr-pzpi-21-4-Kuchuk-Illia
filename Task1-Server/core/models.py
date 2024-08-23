from datetime import datetime

from django.db import models


class Gamer(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()

    user = models.ForeignKey(
        "auth.User", on_delete=models.CASCADE, related_name="gamer"
    )
    games = models.ManyToManyField("Games")
    trainer = models.ForeignKey(
        "Trainer",
        on_delete=models.SET_NULL,
        null=True,
        default=None,
        related_name="gamers",
    )


class Trainer(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    average_skill = models.IntegerField(default=10)

    user = models.ForeignKey(
        "auth.User", on_delete=models.CASCADE, related_name="trainer"
    )

    games = models.ManyToManyField("Games")


class Games(models.Model):
    name = models.CharField(max_length=100)


class Training(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    datetime = models.DateTimeField()
    duration = models.IntegerField()  # in secconds
    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE)
    gamers = models.ManyToManyField(Gamer)


class IoTInformation(models.Model):
    gamer = models.ForeignKey(Gamer, on_delete=models.CASCADE, related_name="iot")
    training = models.ForeignKey(Training, on_delete=models.CASCADE, related_name="iot")

    heart_rate = models.IntegerField()

    datetime = models.DateTimeField(default=datetime.now)
