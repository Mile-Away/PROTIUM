# 设计思路

问：如何处理哪个节点应该怎么运行

答：使用接口管理和倒推法

何谓接口管理和倒推法？

1. 先给节点打上标记，标记其为计算节点还是普通节点
   1. 更新：不需要标记，认为每个节点都是计算节点，每个节点都应该有操作方式
2. 从最后一个计算节点出发，倒序推导得到第一个计算节点/第一次处理的点的列表
3. 开始处理第一批节点，每批节点有自己的输入与输出
   1. 输入有两个来源，一个是 body，一个是 source handle
   2. 输出只有 handle
   3. 每个节点中应写清楚自身逻辑，指定每个输出 handle 的输入来源，这需要一个字典，记录在 handle 中
      1. handle 标记 { source: body|handle, }
         1. 如果是 handle，继续取它的输出 handle，依次取下去
         2. 如果是 body, 取到它的 source
      2. handle 只记录目标的键，不记录目标的值，直到达到一个节点，它的逻辑中需要某个数据，就去取到那个数据

举个例子：

VASP 节点的计算逻辑是获取前四个数据，打包，并上传进行计算

获取上一节点的数据，如果获取到了。

节点中添加字段 logic，记录运行代码。

workflow 中需要一条逻辑链，目前还没有。workflow 是一个树形数据，最末端的node 为一个空对象。

```json
{[
    "node1":{
    "node2":{
       "node3": {
        "node4":{},
        "node5":{}
       },
    "node6":{
        "node7":{}
    },
    "node8":{}
    }
},
"node9":{}
]}
```

直到最后的 Node 的 子 Node 是空，将其定义为叶子 node，依照层级将其定义为

如果在每个节点中存储运行逻辑，就需要提供一个统一的环境可以运行这个运行逻辑。

异步，且递归地运行每个节点。

节点的输入输出格式要统一且规范

空运行逻辑，表示无需运行，发出一个运行完毕的状态

直到它的子节点的所有状态都变成运行完毕，运行父节点，依次递归，最后运行根节点。

现有的产品中就是没有一个统一的逻辑可以处理不同的状态，导致没法拓展。

for i in workflowNode.handles

1. 根据 workflow 的 edges 获取 workflow node 关系的 JSON 对象
2. 在这个 JSON 对象中，异步且递归地运行 nodes 的运行逻辑，运行完毕后发出运行完毕状态。（或者 error 状态，整个流程中止）
3. 当某个节点的子节点的所有状态都变成运行完毕，运行该节点，依次递归，最后运行根节点。
---
## 接下来的核心是处理怎么运行的问题：

例如对于 VASP 提交，它的运行逻辑应该是：

将输入数据写成文件，将文件打成一个压缩包/docker容器，使用 k8s 管理容器任务/提交容器任务。

需要顺畅的取到输入数据，如何从 handle 追溯到源？

```js
instance.handles.find((handle)=> handle.key === "poscar") // 取到 handle 信息

根据 handle，找到 结束点是它的 edge，找到子 node，这时候我需要知道我从这个子 node 的哪里获取数据？

子 node 的输出 handle 中应该记录这个信息，这个数据来自于 {source: handle/body/result, value: handleKey/bodyKey/resultKey}，
TODO 计算结果的信息应该记录于 body 中，计算逻辑也应该记录于对应的 body 中，或者不叫 body? 叫 results? 感觉为了区分和 body 的区别，还是应该单独开一个。

或者其实加一个 type = result，记录结果信息？感觉还是单独列一个 results 比较好。body 就用来存储与用户交互的部分，results 也可以有很多种类，需要单独一张表。


class WorkflowNodeBody(models.Model):

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    node = models.ForeignKey(WorkflowNodeData, on_delete=models.CASCADE, related_name="body")
    type = models.CharField(max_length=50)
    source = models.TextField(blank=True, null=True)
    title = models.CharField(max_length=100, blank=True, null=True)
    attachment = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.node.header} - {self.type}"

如果是来自 handleKey，重复上一过程，如果是来自于 bodyUUID，从其 Source 中获取信息！
```

```python
class WorkflowNodeHandle(models.Model):
    AS_CHOICES = (
        ("target", "Target"),
        ("source", "Source"),
    )
    # 只有不同的节点才能有相同的key，同一个节点相同 type 的key不能相同，不同 type 的key可以相同
    # 所以 unique_together 是 ("node", "type", "key")
    # key 用来判断节点之间是否可以连接
    key = models.CharField(max_length=100)
    node = models.ForeignKey(WorkflowNodeData, on_delete=models.CASCADE, related_name="handles")
    type = models.CharField(max_length=10, choices=AS_CHOICES)
    hasConnected = models.BooleanField(default=False)
    required = models.BooleanField(default=False)
```