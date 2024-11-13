# Create your models here.
import uuid

from accounts.models import User
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver


class Environment(models.Model):
    """
    整体环境配置
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    # active_experiment_env = models.OneToOneField(ExperimentEnv, null=True, blank=True, on_delete=models.SET_NULL)
    # active_calculation_env = models.OneToOneField(CalculationEnv, null=True, blank=True, on_delete=models.SET_NULL)

    # def save(self, *args, **kwargs):
    #     # Ensure this is the only active Environment
    #     if self.pk is None:  # New instance
    #         Environment.objects.all().update(active_experiment_env=None, active_calculation_env=None)
    #     else:  # Existing instance
    #         Environment.objects.exclude(pk=self.pk).update(active_experiment_env=None, active_calculation_env=None)
    #     super().save(*args, **kwargs)
    
    experiment_envs: models.QuerySet["ExperimentEnv"]
    calculation_envs: models.QuerySet["CalculationEnv"]

    class Meta:
        unique_together = ("user", "name")


class ExperimentEnv(models.Model):
    """
    实验室环境配置
    """

    environment = models.ForeignKey(Environment, on_delete=models.CASCADE, related_name="experiment_envs")
    name = models.CharField(max_length=255)
    description = models.TextField()
    is_active = models.BooleanField(default=False)


class CalculationEnv(models.Model):
    """
    计算环境配置
    """

    environment = models.ForeignKey(Environment, on_delete=models.CASCADE, related_name="calculation_envs")
    name = models.CharField(max_length=255)
    description = models.TextField()
    argo_api = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)


class MaterialNode(models.Model):
    """
    通用物料节点，可以是仓库、物料板或物料
    """

    TYPE_CHOICES = [
        ("repository", "Repository"),
        ("plate", "Plate"),
        ("instance", "Instance"),
    ]

    id = models.AutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    experiment_env = models.ForeignKey(ExperimentEnv, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    parent = models.ForeignKey("self", null=True, blank=True, related_name="children", on_delete=models.CASCADE)

    class Meta:
        # 在同一个实验室环境下，同一级别的物料节点名称不能重复，就和文件系统一样
        unique_together = ("name", "parent", "experiment_env")

    def __str__(self):
        return self.name


class MaterialRepository(models.Model):
    """
    物料仓库的详细信息
    """

    material_node = models.OneToOneField(MaterialNode, on_delete=models.CASCADE, primary_key=True)
    position = models.CharField(max_length=255)  # 整个物料仓库处于实验室环境的位置


class MaterialPlate(models.Model):
    """
    物料板的详细信息
    """

    material_node = models.OneToOneField(MaterialNode, on_delete=models.CASCADE, primary_key=True)
    # 添加物料板特有的字段


class MaterialInstance(models.Model):
    """
    物料的详细信息
    """

    material_node = models.OneToOneField(MaterialNode, on_delete=models.CASCADE, primary_key=True)
    # 添加物料特有的字段


@receiver(pre_save, sender=ExperimentEnv)
def ensure_single_active_experiment_env(sender, instance, **kwargs):
    if instance.is_active:
        # Deactivate other active ExperimentEnv instances
        sender.objects.filter(is_active=True).update(is_active=False)


@receiver(pre_save, sender=CalculationEnv)
def ensure_single_active_calculation_env(sender, instance, **kwargs):
    if instance.is_active:
        # Deactivate other active CalculationEnv instances
        sender.objects.filter(is_active=True).update(is_active=False)
