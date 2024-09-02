import json

from accounts.models import User
from django.core.management.base import BaseCommand
from flociety.models import (
    NodeBodySchemaTemplate,
    NodeDataBodyTemplate,
    NodeDataCompileTemplate,
    NodeDataHandleTemplate,
    NodeDataTemplate,
    NodeTemplateLibrary,
)


class Command(BaseCommand):
    help = "Restore NodeTemplateLibrary from backup.json and create superuser"

    def handle(self, *args, **kwargs):
        self.stdout.write("Restoring...")

        self.stdout.write("Creating superuser...")
        user = self.create_superuser()

        self.stdout.write("Restoring node templates...")
        with open("backup.json", "r") as f:
            data = json.load(f)

            for node_template in data:
                self.stdout.write(f"Restoring {node_template['name']}")
                node_template["creator"] = user
                try:
                    NodeTemplateLibrary.objects.get(name=node_template["name"], version=node_template["version"])
                    self.stdout.write(f"{node_template['name']} already exists")
                    continue
                except NodeTemplateLibrary.DoesNotExist:
                    self.stdout.write(f"node_template: {node_template}")
                    node_data = node_template.pop("data")
                    node_template_instance = NodeTemplateLibrary.objects.create(**node_template)

                    # Create NodeDataTemplate
                    node_data_instance = NodeDataTemplate.objects.create(
                        node=node_template_instance, header=node_data["header"], footer=node_data.get("footer", "")
                    )

                    # Create NodeDataHandleTemplate
                    for handle in node_data["handles"]:
                        NodeDataHandleTemplate.objects.create(
                            node=node_data_instance,
                            key=handle["key"],
                            type=handle["type"],
                            label=handle.get("label"),
                            data_source=handle.get("data_source"),
                            data_key=handle.get("data_key"),
                            rope=handle.get("rope"),
                        )

                    # Create NodeDataBodyTemplate and NodeBodySchemaTemplate
                    for body in node_data["body"]:
                        schema = body.pop("schema")
                        body_instance = NodeDataBodyTemplate.objects.create(
                            node=node_data_instance,
                            key=body["key"],
                            type=body["type"],
                            source=body.get("source"),
                            title=body.get("title"),
                            attachment=body.get("attachment"),
                        )
                        NodeBodySchemaTemplate.objects.create(
                            body=body_instance,
                            panel_type=schema["panel_type"],
                            schema=schema["schema"],
                            uiSchema=schema.get("uiSchema"),
                        )

                    # Create NodeDataCompileTemplate
                    for compile_item in node_data["compile"]:
                        compile_instance = NodeDataCompileTemplate.objects.create(
                            node=node_data_instance,
                            key=compile_item["key"],
                            script=compile_item["script"],
                            type=compile_item["type"],
                            source=compile_item.get("source"),
                            title=compile_item.get("title"),
                            attachment=compile_item.get("attachment"),
                        )
                        if "bodies" in compile_item:
                            compile_instance.bodies.set(
                                NodeDataBodyTemplate.objects.filter(key__in=compile_item["bodies"])
                            )

        self.stdout.write(self.style.SUCCESS("Restore successful"))

    def create_superuser(self):
        user, created = User.objects.get_or_create(username="PROTIUM", defaults={"email": "admin@example.com"})
        if created:
            user.set_password("admin")
            user.is_superuser = True
            user.is_staff = True
            user.save()
        return user
