export type GenericRecord = Record<string, unknown>;

export type TreeNode<T> = T & { children: TreeNode<T>[] };
export type TreeOptionNode<T> = T & {
  value: unknown;
  key: unknown;
  children: TreeOptionNode<T>[];
  disabled?: boolean;
};

const cleanTree = (obj: unknown): unknown => {
  if (Object(obj) !== obj) return obj; // primitives are kept
  const cleaned = Array.isArray(obj)
    ? obj.map(cleanTree).filter((v) => v !== undefined)
    : Object.fromEntries(
        Object.entries(obj as Record<string, unknown>)
          .map(([k, v]) => [k, cleanTree(v)])
          .filter(([, v]) => v !== undefined)
      );

  return Object.keys(cleaned as GenericRecord).length ? cleaned : undefined;
};

export const filterArrayInObj = <T extends GenericRecord>(
  arr: T[],
  criteria: GenericRecord
): T[] => {
  return arr.filter((obj) => {
    return Object.keys(criteria).every((c) => {
      return obj[c] == criteria[c];
    });
  });
};

export const replaceUrlPermissions = (data: string): string => {
  return data.replace("/", "").replace("[", "").replace("]", "");
};

type BuildTreeOptions = {
  parentId?: unknown;
  linkKey?: string;
};

export const buildCategoriesTree = <T extends GenericRecord>(
  data: T[],
  options: BuildTreeOptions = {}
): TreeNode<T>[] | undefined => {
  const { parentId = null, linkKey = "categories_id" } = options;

  const nest = (items: T[], _id: unknown = parentId): TreeNode<T>[] => {
    return items
      .filter((item) => item[linkKey] === _id)
      .map((item) => ({
        ...item,
        children: nest(items, item["_id"]),
      }));
  };

  return cleanTree(nest(data)) as TreeNode<T>[] | undefined;
};

type BuildTreeOptionsWithDisable = BuildTreeOptions & {
  disableParents?: boolean;
  sort?: (a: TreeOptionNode<GenericRecord>, b: TreeOptionNode<GenericRecord>) => number;
};

export const buildCategoriesTreeOptions = <T extends GenericRecord>(
  data: T[],
  options: BuildTreeOptionsWithDisable = {}
): TreeOptionNode<T>[] | undefined => {
  const { parentId = null, linkKey = "categories_id", disableParents = false, sort } =
    options;

  const nest = (items: T[], _id: unknown = parentId): TreeOptionNode<T>[] => {
    const nodes = items
      .filter((item) => item[linkKey] === _id)
      .map((item) => {
        const children = nest(items, item["_id"]);
        return {
          ...item,
          value: item["_id"],
          key: item["_id"],
          children,
          disabled: children.length > 0 && disableParents ? true : false,
        };
      });

    if (sort) {
      nodes.sort(sort as (a: TreeOptionNode<T>, b: TreeOptionNode<T>) => number);
    }

    return nodes;
  };

  return cleanTree(nest(data)) as TreeOptionNode<T>[] | undefined;
};
