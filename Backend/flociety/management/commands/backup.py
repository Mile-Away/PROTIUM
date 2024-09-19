import json

from django.core.management.base import BaseCommand
from flociety.models import NodeTemplateLibrary
from flociety.serializers import NodeTemplateLibrarySerializer


# 将 models.py 中的所有 NodeTempleate 备份为 backup.json
class Command(BaseCommand):
    help = "Backup NodeTemplateLibrary to backup.json"

    def handle(self, *args, **kwargs):
        node_templates = NodeTemplateLibrary.objects.all()
        node_templates = NodeTemplateLibrarySerializer(node_templates, many=True).data
        with open("backup.json", "w") as f:
            json.dump(node_templates, f, indent=4)

        self.stdout.write("Backup successful")
