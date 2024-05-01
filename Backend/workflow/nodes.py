import asyncio
import json
import time
from asyncio import Task

import requests
from requests import Response


async def fetch_releases(url: str) -> dict:
    print(f"Start fetch {url}")
    response: Response = await asyncio.to_thread(requests.get, url)

    print("Start sleep")
    await asyncio.sleep(3)

    data = json.loads(response.text)[0]  # 获取最近的 Release
    print(f"Finish fetch {url}")

    return data


async def main() -> None:
    start_time = time.time()
    PyTorchTask: Task[dict] = asyncio.create_task(
        fetch_releases("https://api.github.com/repos/pytorch/pytorch/releases")
    )
    TensorflowTask: Task[dict] = asyncio.create_task(
        fetch_releases("https://api.github.com/repos/tensorflow/tensorflow/releases")
    )

    print("Start Task PyTorch")
    PyTorchResponse = await PyTorchTask

    print("Start Task Tensorflow? Totally Not!")
    TensorflowResponse = await TensorflowTask

    print("-" * 50)
    print(f"最新的 PyTorch 发布信息: {PyTorchResponse['name']}")
    print("发布标签: ", PyTorchResponse["tag_name"])
    print("发布时间: ", PyTorchResponse["published_at"])
    PyTorchReleaseContent = PyTorchResponse["body"]
    with open("PyTorch_Latest_Release.md", "w") as f:
        f.write(PyTorchReleaseContent)

    print("-" * 50)
    print(f"最新的 TensorFlow 发布信息: {TensorflowResponse['name']}")
    print("发布标签: ", TensorflowResponse["tag_name"])
    print("发布时间: ", TensorflowResponse["published_at"])
    TensorflowReleaseContent = TensorflowResponse["body"]

    with open("Tensorflow_Latest_Release.md", "w") as f:
        f.write(TensorflowReleaseContent)

    print("-" * 50)
    finish_time = time.time()
    print(f"Running Time: {finish_time - start_time}")


if __name__ == "__main__":
    asyncio.run(main=main())


