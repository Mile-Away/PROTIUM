# Generated by Django 5.0.4 on 2024-08-15 12:23

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="NodeDataTemplate",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("header", models.TextField(blank=True, null=True)),
                ("footer", models.TextField(blank=True, null=True)),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="NodeDataBodyTemplate",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("key", models.CharField(max_length=100)),
                ("type", models.CharField(max_length=50)),
                ("source", models.JSONField(blank=True, null=True)),
                ("title", models.CharField(blank=True, max_length=100, null=True)),
                ("attachment", models.CharField(blank=True, max_length=100, null=True)),
                (
                    "node",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="body",
                        to="flociety.nodedatatemplate",
                    ),
                ),
            ],
            options={
                "unique_together": {("node", "key")},
            },
        ),
        migrations.CreateModel(
            name="NodeTemplateLibrary",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("description", models.TextField(blank=True, null=True)),
                ("version", models.CharField(default="0.0.0", max_length=50)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("public", models.BooleanField(default=False)),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("Solver", "Solver"),
                            ("Basic", "Basic"),
                            ("Select", "Select"),
                            ("Input", "Input"),
                        ],
                        max_length=50,
                    ),
                ),
                (
                    "creator",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="node_template_library",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "unique_together": {("name", "version")},
            },
        ),
        migrations.AddField(
            model_name="nodedatatemplate",
            name="node",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="data",
                to="flociety.nodetemplatelibrary",
            ),
        ),
        migrations.CreateModel(
            name="NodeDataHandleTemplate",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("key", models.CharField(max_length=100)),
                ("label", models.CharField(blank=True, max_length=100, null=True)),
                (
                    "type",
                    models.CharField(
                        choices=[("target", "Target"), ("source", "Source")],
                        max_length=10,
                    ),
                ),
                (
                    "data_source",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("handle", "Handle"),
                            ("body", "Body"),
                            ("compile", "Compile"),
                        ],
                        max_length=10,
                        null=True,
                    ),
                ),
                ("data_key", models.CharField(blank=True, max_length=100, null=True)),
                ("rope", models.CharField(blank=True, max_length=100, null=True)),
                (
                    "node",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="handles",
                        to="flociety.nodedatatemplate",
                    ),
                ),
            ],
            options={
                "unique_together": {("node", "type", "key")},
            },
        ),
        migrations.CreateModel(
            name="NodeDataCompileTemplate",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("key", models.CharField(max_length=100)),
                ("script", models.CharField(blank=True, null=True)),
                ("source", models.TextField(blank=True, null=True)),
                ("type", models.CharField(blank=True, max_length=50, null=True)),
                ("title", models.CharField(blank=True, max_length=100, null=True)),
                ("attachment", models.CharField(blank=True, max_length=100, null=True)),
                (
                    "bodies",
                    models.ManyToManyField(
                        blank=True,
                        related_name="compile",
                        to="flociety.nodedatabodytemplate",
                    ),
                ),
                (
                    "node",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="compile",
                        to="flociety.nodedatatemplate",
                    ),
                ),
            ],
            options={
                "unique_together": {("node", "key")},
            },
        ),
    ]