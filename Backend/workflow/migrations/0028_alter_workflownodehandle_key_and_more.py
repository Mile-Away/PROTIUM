# Generated by Django 5.1.1 on 2024-09-20 09:50

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0027_alter_workflownode_draghandle'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workflownodehandle',
            name='key',
            field=models.CharField(help_text='Key 只能包含字母，数字和横杠，不允许空格和下划线', max_length=100, validators=[django.core.validators.RegexValidator(message='Name can only contain letters, numbers, and hyphens. underscores is not allowed.', regex='^[a-zA-Z0-9-]+$')]),
        ),
        migrations.AlterField(
            model_name='workflownodehandle',
            name='label',
            field=models.CharField(blank=True, help_text='Label 暂时不生效，未来可能用于控制 handle 在节点上显示的内容', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='workflownodehandle',
            name='rope',
            field=models.CharField(blank=True, help_text='rope 即将失去作用，无需填写', max_length=100, null=True),
        ),
    ]