import type { UniqueIdentifier } from '@dnd-kit/core';
import type { MutableRefObject } from 'react';

interface LogProps {
  timestamp: number;
  message: string;
}

export interface TreeItemProps {
  id: UniqueIdentifier;
  dirs?: UniqueIdentifier[];
  children: TreeItemProps[];
  collapsed?: boolean;

  type?: 'Repository' | 'Plate' | 'Container'| "Tip";
  // 每个类型都单独定义，维护一个注册表
  // 对于每个类型，比如说 Repo，Tip，他们可以有 data，jsonSchema，Comp，
  // 等到数量多的时候，抽象出来
  category?: string;
  position?: {
    x: number;
    y: number;
    z?: number;
  };
  layout?: {
    gridContainerColumns?: number;
    itemCount?: number;
  };
  status?: 'active' | 'inactive' | 'disabled' | 'idle';
  data?: {}
  jsonSchema?: {}
  logs?: LogProps[];
}

// string name
// string type
// float32 size_x
// float32 size_y
// float32 size_z
// geometry_msgs/Vector3 location
// geometry_msgs/Vector3 rotation
// string category
// string model
// string[] children  # 包含自身类型的数组，用于嵌套结构
// string parent_name
// - string[] ordering  # 枪头盒TipRack、孔板Plate 使用，用于指定孔位顺序
// TipInfo prototype_tip  # TipSpot 使用，用于指定孔位信息
// ContainerInfo container_info  # Container 使用
// WellInfo well_info  # Container 使用

export interface BlankItemProps {
  // children is not allowed in BlankItemProps, it is used as a type guard
  id: UniqueIdentifier;
  dirs?: UniqueIdentifier[];
  position?: {
    x: number;
    y: number;
    z?: number;
  };
  conflict?: boolean;
  conflictItems?: TreeItemProps[];
  msg?: string;
}

export type TreeItems = TreeItemProps[];

export interface FlattenedItemProps extends TreeItemProps {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItemProps[];
  offset: number;
}>;
