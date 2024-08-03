# Generated by Django 5.0.7 on 2024-08-03 09:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_course_avatar_lesson_avatar'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lesson',
            name='avatar',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='content',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='course',
        ),
        migrations.AlterField(
            model_name='lesson',
            name='title',
            field=models.CharField(max_length=255, verbose_name='Название урока'),
        ),
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='Название модуля')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='modules', to='api.course', verbose_name='Курс')),
            ],
        ),
        migrations.AddField(
            model_name='lesson',
            name='module',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='lessons', to='api.module', verbose_name='Модуль'),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Step',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(verbose_name='Порядок')),
                ('step_type', models.CharField(choices=[('text', 'Text'), ('video', 'Video'), ('question', 'Question')], max_length=10, verbose_name='Тип шага')),
                ('content', models.JSONField(blank=True, null=True, verbose_name='Контент')),
                ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='steps', to='api.lesson', verbose_name='Урок')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
    ]
