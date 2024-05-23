from django.db import models

from server.models import Server

# Create your models here.


class GithubServerIntergration(models.Model):
    server = models.OneToOneField(Server, on_delete=models.CASCADE, related_name="github")

    def __str__(self):
        return self.server.name


class GithubUser(models.Model):
    id = models.IntegerField(primary_key=True, editable=True)
    login = models.CharField(max_length=255)
    node_id = models.CharField(max_length=255)
    avatar_url = models.URLField(blank=True, null=True)
    gravatar_id = models.CharField(max_length=255, blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    html_url = models.URLField(blank=True, null=True)
    followers_url = models.URLField(blank=True, null=True)
    following_url = models.URLField(blank=True, null=True)
    gists_url = models.URLField(blank=True, null=True)
    starred_url = models.URLField(blank=True, null=True)
    subscriptions_url = models.URLField(blank=True, null=True)
    organizations_url = models.URLField(blank=True, null=True)
    repos_url = models.URLField(blank=True, null=True)
    events_url = models.URLField(blank=True, null=True)
    received_events_url = models.URLField(blank=True, null=True)
    type = models.CharField(max_length=255, blank=True, null=True)
    site_admin = models.BooleanField(blank=True, null=True)

    def __str__(self):
        return f"{self.login}"


class GithubRelease(models.Model):
    id = models.IntegerField(primary_key=True, editable=True)
    server = models.ForeignKey(GithubServerIntergration, on_delete=models.CASCADE, related_name="releases")
    url = models.URLField(blank=True, null=True)
    assets_url = models.URLField(blank=True, null=True)
    upload_url = models.URLField(blank=True, null=True)
    html_url = models.URLField(blank=True, null=True)
    author = models.ForeignKey(GithubUser, on_delete=models.CASCADE, blank=True, null=True)
    node_id = models.CharField(max_length=255, blank=True, null=True)
    tag_name = models.CharField(max_length=255, blank=True, null=True)
    target_commitish = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    draft = models.BooleanField(blank=True, null=True)
    prerelease = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField()
    published_at = models.DateTimeField()
    tarball_url = models.URLField(blank=True, null=True)
    zipball_url = models.URLField(blank=True, null=True)
    body = models.TextField()
    reactions = models.JSONField(blank=True, null=True)
    mentions_count = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.server}"


class GithubAsset(models.Model):
    id = models.IntegerField(primary_key=True, editable=True)
    release = models.ForeignKey(GithubRelease, on_delete=models.CASCADE, related_name="assets")
    url = models.URLField(blank=True, null=True)
    node_id = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    label = models.CharField(max_length=25, blank=True, null=True)
    uploader = models.ForeignKey(GithubUser, on_delete=models.CASCADE)
    content_type = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    size = models.IntegerField()
    download_count = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    browser_download_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.name}"


"""
// API Path: https://api.github.com/repos/USERNAME/REPO/readme/
export interface ReadmeProps {}

// API Path: https://api.github.com/repos/USERNAME/REPO/releases/
export interface ReleaseProps {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: {
    url: string;
    id: number;
    node_id: string;
    name: string;
    label: string;
    uploader: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
    };
    content_type: string;
    state: string;
    size: number;
    download_count: number;
    created_at: string;
    updated_at: string;
    browser_download_url: string;
  }[];
  tarball_url: string;
  zipball_url: string;
  body: string;
  reactions: {
    url: string;
    total_count: number;
  };
  mentions_count: number;
}

"""
