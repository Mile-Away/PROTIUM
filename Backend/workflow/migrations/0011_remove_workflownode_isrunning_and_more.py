# Generated by Django 5.0.4 on 2024-05-08 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0010_workflownode_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='workflownode',
            name='isRunning',
        ),
        migrations.AlterField(
            model_name='workflownode',
            name='status',
            field=models.CharField(blank=True, choices=[('draft', 'Draft'), ('success', 'Success'), ('failed', 'Failed'), ('running', 'Running'), ('pending', 'Pending')], max_length=10, null=True),
        ),
    ]