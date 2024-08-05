from rest_framework.renderers import JSONRenderer


class EmptyBrowsableAPIRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        request = renderer_context.get("request", None)  # type: ignore

        # If the request is for HTML, return an empty string
        if request and "text/html" in request.META.get("HTTP_ACCEPT", ""):
            return b""
        return super().render(data, accepted_media_type, renderer_context)
