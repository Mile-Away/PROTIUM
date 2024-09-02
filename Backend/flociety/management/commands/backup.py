import json

from flociety.models import NodeTemplateLibrary

from flociety.serializers import NodeTemplateLibrarySerializer


# 将 models.py 中的所有 NodeTempleate 备份为 backup.json
def backup_node_template_library():
    node_templates = NodeTemplateLibrary.objects.all()
    node_templates = NodeTemplateLibrarySerializer(node_templates, many=True).data
    with open("backup.json", "w") as f:
        json.dump(node_templates, f, indent=4)

    print("Backup successful")
