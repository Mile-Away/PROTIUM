# Generated by Django 5.0.4 on 2024-08-16 06:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("flociety", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="nodedatatemplate",
            name="node",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="node_data",
                to="flociety.nodetemplatelibrary",
            ),
        ),
    ]