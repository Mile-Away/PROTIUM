import os
import time
from urllib.parse import urljoin

import requests
from requests.models import Response


class RequestInfoException(Exception):
    pass


class Client:
    def __init__(
        self,
        access_key: str,
        host: str = os.getenv("OPENAPI_HOST", "https://openapi.dp.tech"),
        ticket: str = os.getenv("BHOR_TICKET", ""),
    ) -> None:

        self.host = host

        self.ticket = ticket
        self.access_key = access_key

        if not self.access_key:
            raise Exception("AccessKey is required")

        self.params = {"accessKey": self.access_key}
        self.token = ""
        self.check_ak()

    def post(self, url, host="", json=None, data=None, headers=None, params=None, stream=False, retry=5):
        return self._req(
            "POST", url, host=host, json=json, data=data, headers=headers, params=params, stream=stream, retry=retry
        )

    def get(self, url, host="", json=None, headers=None, params=None, stream=False, retry=5):
        return self._req("GET", url, host=host, json=json, headers=headers, params=params, stream=stream, retry=retry)

    def _req(
        self, method, url, host="", json=None, data=None, headers=None, params=None, stream=False, retry=3
    ) -> dict:
        if host:
            url = urljoin(host, url)
        else:
            url = urljoin(self.host, url)
        # Set Headers
        if headers is None:
            headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        if self.ticket:
            headers["Brm-Ticket"] = self.ticket

        # headers['bohr-client'] = f'utility:0.0.2'
        resp_code = None

        for i in range(retry):
            err = ""
            if method == "GET":
                resp: Response = requests.get(url=url, params=params, headers=headers, stream=stream)
            elif method == "POST":
                resp: Response = requests.post(
                    url=url, json=json, data=data, params=params, headers=headers, stream=stream
                )
            else:
                raise Exception("Method not supported")

            resp_code = resp.status_code

            if resp_code == 401:
                raise Exception("Unauthorized")

            if not resp.ok:
                try:
                    result = resp.json()
                    err = result.get("error")
                except (ValueError, Exception) as e:
                    print(
                        f"Request {method} {url} failed.",
                        "params:{params} Json:{json}, retry {i+1} times, error: {resp.content}",
                    )
                    print(f"Error: {str(e)}")
                time.sleep(2)
                continue

            result = resp.json()

            # if isinstance(result, str):
            #     return result

            if result.get("model", "") == "gpt-35-turbo":
                return result["choices"][0]["message"]["content"]

            elif result["code"] == 0:
                return result.get("data", {})

            else:
                err = result.get("message") or result.get("error")
                print(f"Request {method} {url} failed params:{params} Json:{json}")
                break

        raise RequestInfoException(resp_code, url, err)  # type: ignore

    def check_ak(self):
        url = "/openapi/v1/ak/get"
        resp = self.get(url=url, params=self.params)
        if isinstance(resp, dict) and resp.get("user_id", 0) != 0:
            pass
        return resp

    def chat(self, prompt, temperature=0):
        post_data = {
            "messages": [{"role": "user", "content": f"{prompt}"}],
            "stream": False,
            "model": "gpt-3.5-turbo",
            "temperature": temperature,
            "presence_penalty": 0,
        }

        resp = self.post("/openapi/v1/chat/complete", json=post_data, params=self.params)
        return resp
