# Generated by Django 5.0.4 on 2024-05-28 08:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0018_alter_workflownode_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='WorkflowConsole',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('message', models.TextField()),
                ('workflow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='consoles', to='workflow.workflow')),
            ],
        ),
        migrations.CreateModel(
            name='WorkflowNodeMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('info', 'Info'), ('warning', 'Warning'), ('error', 'Error')], default='info', max_length=10)),
                ('message', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('node', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='workflow.workflownodedata')),
            ],
        ),
    ]