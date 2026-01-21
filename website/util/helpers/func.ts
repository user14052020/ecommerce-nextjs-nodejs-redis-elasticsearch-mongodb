type VariantProduct = {
   price: number;
   before_price: number;
};

type ProductLike = {
   variant_products?: VariantProduct[];
   price?: number;
   before_price?: number;
   [key: string]: unknown;
};

type TreeNode = {
   title?: unknown;
   children?: TreeNode[];
};

type TreeOptionNode<T> = T & {
   value: unknown;
   key: unknown;
   children: TreeOptionNode<T>[];
   disabled?: boolean;
};

type SelectableCategory = {
   _id: string;
};

const getDiscount = (data: ProductLike): number | undefined => {
   const variants = data.variant_products || [];
   if (variants.length > 0) {
      const discount_variants = [];
         variants.forEach((x) => {
            if (x.price < x.before_price) {
               discount_variants.push(
                  ((x.before_price - x.price) / x.before_price) * 100
               );
            }
         });

         return discount_variants.sort(function (a, b) {
            return b - a;
         })[0];
      } else {
         if (
            typeof data.price === "number" &&
            typeof data.before_price === "number" &&
            data.price < data.before_price
         ) {
            return ((data.before_price - data.price) / data.before_price) * 100;
         }
      }
   return undefined;
};

const filter_array_in_obj = <T extends Record<string, unknown>>(
   arr: T[],
   criteria: Record<string, unknown>
): T[] => {
      return arr.filter(function (obj) {
         return Object.keys(criteria).every(function (c) {
            return obj[c] == criteria[c];
         });
      });
};

const search_array_object_tree = (termx: string, dataAllx: TreeNode[]) => {
      const dfs = (node: TreeNode, term: string, foundIDS: string[]) => {
      // Implement your search functionality

         const titleText = typeof node.title === "string" ? node.title : "";
         let isMatching =
        titleText &&
        titleText.toLowerCase().search(term.toLowerCase()) !== -1;

         if (Array.isArray(node.children)) {
            node.children.forEach((child) => {
               const hasMatchingChild = dfs(child, term, foundIDS);
               isMatching = isMatching || hasMatchingChild;
            });
         }

         // We will add any item if it matches our search term or if it has a children that matches our term
         if (isMatching && titleText) {
            foundIDS.push(titleText);
         }

         return isMatching;
      };

      const filter = (data: TreeNode[], matchedIDS: string[]) => {
         return data
            .filter((item) => {
               const titleText = typeof item.title === "string" ? item.title : "";
               return matchedIDS.indexOf(titleText) > -1;
            })
            .map((item) => ({
               ...item,
               children: item.children ? filter(item.children, matchedIDS) : [],
            }));
      };

      const data = dataAllx;

      const dataNode = {
         children: data,
      };

      const matchedIDS = [];
      // find all items IDs that matches our search (or their children does)
      dfs(dataNode, termx, matchedIDS);

      // filter the original data so that only matching items (and their fathers if they have) are returned
      return filter(data, matchedIDS);
};

const replaceUrlPermissions = (data: string) => {
      return data.replace("/", "").replace("[", "").replace("]", "");
};

const getCategoriesTree = <T extends Record<string, unknown>>(
   data: T[],
   parrent: string | null = null
) => {
      const nest = (items: T[], _id = parrent, link = "categories_id") => {
         return items
            .filter((item) => item[link] === _id)
            .map((item) => ({ ...item, children: nest(items, item._id) }));
      };

      const clean = (obj: unknown): unknown => {
         if (Object(obj) !== obj) return obj; // primitives are kept
         obj = Array.isArray(obj)
         ? obj.map(clean).filter((v) => v !== undefined)
         : Object.fromEntries(
               Object.entries(obj as Record<string, unknown>)
                  .map(([k, v]) => [k, clean(v)])
                  .filter(([_, v]) => v !== undefined)
            );
         return Object.keys(obj).length ? obj : undefined;
      };
      return clean(nest(data));
};

const selectCategoriesFilterData = (datas: SelectableCategory[]) => {
      if (datas.length > 0) {
         const data = Object.entries(datas).map(([, y]) => y._id);
         return data;
      }
   return undefined;
};

const getCategoriesTreeOptions = <T extends Record<string, unknown>>(
   data: T[],
   option = false
) => {
      const nest = (
         items: T[],
         _id: string | null = null,
         link = "categories_id"
      ): TreeOptionNode<T>[] => {
         return items
            .filter((item) => item[link] === _id)
            .map((item) => ({
               ...item,
               value: item._id,
               key: item._id,
               children: nest(items, item._id),
               disabled:
            nest(items, item._id).length > 0 && option === true ? true : false,
            })).sort(function (a, b) {
               return a.order - b.order;
            });
      };

      const clean = (obj: unknown): unknown => {
         if (Object(obj) !== obj) return obj; // primitives are kept
         obj = Array.isArray(obj)
            ? obj.map(clean).filter((v) => v !== undefined)
            : Object.fromEntries(
               Object.entries(obj as Record<string, unknown>)
                  .map(([k, v]) => [k, clean(v)])
                  .filter(([_, v]) => v !== undefined)
            );
         return Object.keys(obj).length ? obj : undefined;
      };

      const firstdata = clean(nest(data));
      return firstdata;
};

export default {
   getDiscount,
   filter_array_in_obj,
   search_array_object_tree,
   replaceUrlPermissions,
   getCategoriesTree,
   selectCategoriesFilterData,
   getCategoriesTreeOptions,
};
