# Generated by Django 5.0.4 on 2024-07-25 04:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0021_workflownodecompile_delete_workflownoderesult'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workflownodebody',
            name='source',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='workflownodehandle',
            name='data_source',
            field=models.CharField(blank=True, choices=[('handle', 'Handle'), ('body', 'Body'), ('compile', 'Compile')], max_length=10, null=True),
        ),
    ]