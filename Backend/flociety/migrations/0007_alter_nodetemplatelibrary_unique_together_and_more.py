# Generated by Django 5.1.1 on 2024-09-20 09:50

import django.core.validators
import django.db.models.deletion
import flociety.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flociety', '0006_alter_nodedatahandletemplate_key_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='nodetemplatelibrary',
            unique_together={('name', 'creator')},
        ),
        migrations.AlterField(
            model_name='nodedatahandletemplate',
            name='key',
            field=models.CharField(help_text='Key 只能包含字母，数字和横杠，不允许空格和下划线', max_length=100, validators=[django.core.validators.RegexValidator(message='Name can only contain letters, numbers, and hyphens. underscores is not allowed.', regex='^[a-zA-Z0-9-]+$')]),
        ),
        migrations.AlterField(
            model_name='nodedatahandletemplate',
            name='label',
            field=models.CharField(blank=True, help_text='Label 暂时不生效，未来可能用于控制 handle 在节点上显示的内容', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='nodedatahandletemplate',
            name='rope',
            field=models.CharField(blank=True, help_text='rope 即将失去作用，无需填写', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='nodetemplatelibrary',
            name='name',
            field=models.CharField(help_text='Name 只能包含字母，数字，下划线和短横线，不允许空格', max_length=100, validators=[django.core.validators.RegexValidator(message='Name can only contain letters, numbers, underscores, and hyphens.', regex='^[a-zA-Z0-9_-]+$'), flociety.models.validate_node_name]),
        ),
        migrations.RemoveField(
            model_name='nodetemplatelibrary',
            name='version',
        ),
        migrations.CreateModel(
            name='NodeTemplateVersion',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('version', models.CharField(default='0.0.0', max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('node', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='versions', to='flociety.nodetemplatelibrary')),
            ],
            options={
                'unique_together': {('node', 'version')},
            },
        ),
    ]