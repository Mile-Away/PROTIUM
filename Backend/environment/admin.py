from django.contrib import admin

from .models import (
    CalculationEnv,
    Environment,
    ExperimentEnv,
    MaterialInstance,
    MaterialNode,
    MaterialPlate,
    MaterialRepository,
)

admin.site.register(Environment)
admin.site.register(ExperimentEnv)
admin.site.register(CalculationEnv)
admin.site.register(MaterialNode)
admin.site.register(MaterialRepository)
admin.site.register(MaterialPlate)
admin.site.register(MaterialInstance)
