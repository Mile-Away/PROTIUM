# Generated by Django 5.1.2 on 2024-11-06 09:57

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('document', '0001_initial'),
        ('search', '0001_initial'),
        ('server', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='globalsearchhistory',
            name='channel',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='server.channel'),
        ),
        migrations.AddField(
            model_name='globalsearchhistory',
            name='document',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='document.document'),
        ),
        migrations.AddField(
            model_name='globalsearchhistory',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='search_history', to=settings.AUTH_USER_MODEL),
        ),
    ]