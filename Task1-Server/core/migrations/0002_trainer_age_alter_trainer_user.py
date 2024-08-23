# Generated by Django 5.1 on 2024-08-15 17:11

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="trainer",
            name="age",
            field=models.IntegerField(default=18),
        ),
        migrations.AlterField(
            model_name="trainer",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="trainer",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
