---
title: 1009课后总结
published: 2026-10-10
tags: []
category: ''
draft: false
---

首先呢，这节课回顾了一下上节课的内容，复习了顺序表的存储结构。

```c
#define MAXSIZE 100
typedef struct
{
    ElemType *elem;
    int length;
}SqList;
```

**说明：**

1. 数组指针 `elem` 指示顺序表的基地址，数组空间大小为 `MAXSIZE`。
2. `length` 表示顺序表中当前数据元素的个数。

在顺序表中的基本操作：

1. 初始化
2. 取值（顺序存储结构具有**随机存取**的特点）
3. 查找
4. 插入
5. 删除
