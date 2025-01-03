# Generated by Django 5.1.2 on 2024-11-06 09:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('flociety', '0001_initial'),
        ('workflow', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='workflowtemplatelibrary',
            name='workflow',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='template', to='workflow.workflow'),
        ),
        migrations.AlterUniqueTogether(
            name='nodedatahandletemplate',
            unique_together={('node', 'type', 'key')},
        ),
        migrations.AlterUniqueTogether(
            name='nodedatacompiletemplate',
            unique_together={('node', 'key')},
        ),
        migrations.AlterUniqueTogether(
            name='nodedatabodytemplate',
            unique_together={('node', 'key')},
        ),
        migrations.AlterUniqueTogether(
            name='nodetemplatelibrary',
            unique_together={('name', 'version')},
        ),
    ]
