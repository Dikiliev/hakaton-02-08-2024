# Generated by Django 5.0.7 on 2024-08-04 01:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_remove_courseprogress_completed'),
    ]

    operations = [
        migrations.AddField(
            model_name='courseprogress',
            name='completed',
            field=models.BooleanField(default=False),
        ),
    ]