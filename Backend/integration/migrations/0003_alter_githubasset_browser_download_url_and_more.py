# Generated by Django 5.0.4 on 2024-05-23 07:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('integration', '0002_remove_githubuser_server'),
    ]

    operations = [
        migrations.AlterField(
            model_name='githubasset',
            name='browser_download_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubasset',
            name='content_type',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='githubasset',
            name='created_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubasset',
            name='download_count',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubasset',
            name='name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='githubasset',
            name='node_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='githubasset',
            name='state',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='githubasset',
            name='updated_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubasset',
            name='url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='assets_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='draft',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='html_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='mentions_count',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='node_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='prerelease',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='reactions',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='tag_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='tarball_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='target_commitish',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='upload_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubrelease',
            name='zipball_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='avatar_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='events_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='followers_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='following_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='gists_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='html_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='organizations_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='received_events_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='repos_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='site_admin',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='starred_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='subscriptions_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='type',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='githubuser',
            name='url',
            field=models.URLField(blank=True, null=True),
        ),
    ]