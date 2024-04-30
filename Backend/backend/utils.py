import re

from rest_framework import serializers


class HighlightedCharField(serializers.CharField):
    def to_representation(self, value):

        value = super().to_representation(value)

        query = self.context.get("query", None)

        if query is not None:
            query_pattern = re.compile(re.escape(query), re.IGNORECASE)
            value = query_pattern.sub(r"<b class='dark:text-indigo-400 text-indigo-600'>\g<0></b>", value)

        return value
