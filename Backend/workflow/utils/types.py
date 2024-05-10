# from typing import Literal, Optional, TypedDict

# # export interface WorkflowNodeDataBodyProps {
# #   id: string;
# #   type: 'input' | 'select' | 'textarea' | 'file';
# #   key: string;
# #   source: string;
# #   title?: string;
# #   attachment?: string;
# # }


# # WorkflowNodeDataBodyProps: TypeAlias = (
# #     dict[Literal["id", "key", "source", "title", "attachment"], str | None]
# #     | dict[Literal["type"], Literal["input", "select", "textarea", "file"]]
# # )


# # def print_WorkflowNodeDataBodyProps(
# #     body: WorkflowNodeDataBodyProps
# # ):
# #     print(body)


# # print_WorkflowNodeDataBodyProps({
# #     "id": "1",
# #     "key": "key",
# #     "source": "source",
# #     "title": "title",
# #     "attachment": "attachment"
# # })


# class WorkflowNodeDataBodyProps(TypedDict, total=True):
#     id: str | Literal[1]
#     key: Optional[str]
#     source: Optional[str]
#     title: Optional[str]
#     attachment: Optional[str]
#     type: Optional[Literal["input", "select", "textarea", "file"]]


# class WorkflowNodeDataProps(WorkflowNodeDataBodyProps, total=False):
#     handles: str
#     body: Optional[int]


# # EXPLAIN: TypeAlias 只能实现粗略的字典类型，无法实现更复杂的字典类型
# # 第一步，熟练掌握 Literal、Optional、TypedDict、Union 等类型
# # WorkflowNodeDataBodyProps: TypeAlias = dict[
# #     Literal["id", "key", "source", "title", "attachment", "type"],
# #     Union[str, Literal[1]]
# # ]


# def print_WorkflowNodeDataBodyProps(body: WorkflowNodeDataProps):
#     print(body)


# print_WorkflowNodeDataBodyProps(
#     {
#         "id": 1,
#         "type": "input",
#         "key": "key",
#         "source": "source",
#         "title": "title",
#         "attachment": "attachment",
#         "handles": "handles",
#         "body": 1,
#     }
# )
# # class WorkflowNodeDataBodyProps(TypedDict, total=False):
# #     id: str
# #     type: Literal["input", "select", "textarea", "file"]
# #     key: str
# #     source: str
# #     title: Optional[str]
# #     attachment: Optional[str]
# #     # 添加更多可选字段
# #     uuid: Optional[str]

# # ...


# # export interface WorkflowNodeProps
# #   extends Node<WorkflowNodeDataProps, keyof typeof nodeTypes> {
# #   id: string;
# #   type?: keyof typeof nodeTypes;
# #   data: WorkflowNodeDataProps;
# #   dragHandle?: string | '.drag-handle';
# #   position: { x: number; y: number };
# #   isRunning?: boolean;
# # }
