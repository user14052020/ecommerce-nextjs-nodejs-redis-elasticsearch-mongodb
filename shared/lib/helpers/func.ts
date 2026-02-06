import {
  buildCategoriesTree,
  buildCategoriesTreeOptions,
  filterArrayInObj,
  replaceUrlPermissions,
} from "./categories";
import type { GenericRecord } from "./categories";

export type VariantProduct = {
  price: number;
  before_price: number;
};

export type ProductLike = {
  variant_products?: VariantProduct[];
  price?: number;
  before_price?: number;
  [key: string]: unknown;
};

export type TreeNode = {
  title?: unknown;
  children?: TreeNode[];
};

export type SelectableCategory = {
  _id: string;
};

export type OptionItem = {
  label: string;
  value: string;
};

export type TurkeyMahalle = {
  Mahalle: string;
};

export type TurkeySemt = {
  Semt: string;
  Mahalle: TurkeyMahalle[];
};

export type TurkeyIlce = {
  Ilce: string;
  Semt: TurkeySemt[];
};

export type TurkeyCity = {
  Il: string;
  Ilce: TurkeyIlce[];
};

export type CountryItem = {
  name: string;
  states: { name: string }[];
};

export type OptionWithData<T> = {
  option: OptionItem[];
  data: T[];
};

export type SelectedOptions = {
  selectedCountry?: string;
  selectedCity?: string;
  selectedIlce?: string;
  selectedSemt?: string;
  selectedMahalle?: string;
};

export const getDiscount = (data: ProductLike): number | undefined => {
  const variants = data.variant_products || [];
  if (variants.length > 0) {
    const discount_variants: number[] = [];
    variants.forEach((x) => {
      if (x.price < x.before_price) {
        discount_variants.push(
          ((x.before_price - x.price) / x.before_price) * 100
        );
      }
    });

    return discount_variants.sort((a, b) => b - a)[0];
  }
  if (
    typeof data.price === "number" &&
    typeof data.before_price === "number" &&
    data.price < data.before_price
  ) {
    return ((data.before_price - data.price) / data.before_price) * 100;
  }
  return undefined;
};

export const filter_array_in_obj = <T extends GenericRecord>(
  arr: T[],
  criteria: GenericRecord
): T[] => {
  return filterArrayInObj(arr, criteria);
};

export const search_array_object_tree = (termx: string, dataAllx: TreeNode[]) => {
  const dfs = (node: TreeNode, term: string, foundIDS: string[]) => {
    const titleText = typeof node.title === "string" ? node.title : "";
    let isMatching =
      titleText && titleText.toLowerCase().search(term.toLowerCase()) !== -1;

    if (Array.isArray(node.children)) {
      node.children.forEach((child) => {
        const hasMatchingChild = dfs(child, term, foundIDS);
        isMatching = isMatching || hasMatchingChild;
      });
    }

    if (isMatching && titleText) {
      foundIDS.push(titleText);
    }

    return isMatching;
  };

  const filter = (data: TreeNode[], matchedIDS: string[]): TreeNode[] => {
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

  const matchedIDS: string[] = [];
  dfs(dataNode, termx, matchedIDS);

  return filter(data, matchedIDS);
};

export const getCategoriesTree = <T extends GenericRecord>(
  data: T[],
  parrent: string | null = null
) => {
  return buildCategoriesTree(data, { parentId: parrent });
};

export const selectCategoriesFilterData = (datas: SelectableCategory[]) => {
  if (datas.length > 0) {
    const data = Object.entries(datas).map(([, y]) => y._id);
    return data;
  }
  return undefined;
};

export const getCategoriesTreeOptions = <T extends GenericRecord>(
  data: T[],
  option = false
) => {
  return buildCategoriesTreeOptions(data, {
    disableParents: option,
    sort: (a, b) =>
      ((a as GenericRecord).order as number) -
      ((b as GenericRecord).order as number),
  });
};

export const replaceSeoUrl = (textString: string): string => {
  textString = textString.replace(/ /g, "-");
  textString = textString.replace(/</g, "");
  textString = textString.replace(/>/g, "");
  textString = textString.replace(/"/g, "");
  textString = textString.replace(/é/g, "");
  textString = textString.replace(/!/g, "");
  textString = textString.replace(/’/, "");
  textString = textString.replace(/£/, "");
  textString = textString.replace(/^/, "");
  textString = textString.replace(/#/, "");
  textString = textString.replace(/$/, "");
  textString = textString.replace(/\+/g, "");
  textString = textString.replace(/%/g, "");
  textString = textString.replace(/½/g, "");
  textString = textString.replace(/&/g, "");
  textString = textString.replace(/\//g, "");
  textString = textString.replace(/{/g, "");
  textString = textString.replace(/\(/g, "");
  textString = textString.replace(/\[/g, "");
  textString = textString.replace(/\)/g, "");
  textString = textString.replace(/]/g, "");
  textString = textString.replace(/=/g, "");
  textString = textString.replace(/}/g, "");
  textString = textString.replace(/\?/g, "");
  textString = textString.replace(/\*/g, "");
  textString = textString.replace(/@/g, "");
  textString = textString.replace(/€/g, "");
  textString = textString.replace(/~/g, "");
  textString = textString.replace(/æ/g, "");
  textString = textString.replace(/ß/g, "");
  textString = textString.replace(/;/g, "");
  textString = textString.replace(/,/g, "");
  textString = textString.replace(/`/g, "");
  textString = textString.replace(/|/g, "");
  textString = textString.replace(/\./g, "");
  textString = textString.replace(/:/g, "");
  textString = textString.replace(/İ/g, "i");
  textString = textString.replace(/I/g, "i");
  textString = textString.replace(/ı/g, "i");
  textString = textString.replace(/ğ/g, "g");
  textString = textString.replace(/Ğ/g, "g");
  textString = textString.replace(/ü/g, "u");
  textString = textString.replace(/Ü/g, "u");
  textString = textString.replace(/ş/g, "s");
  textString = textString.replace(/Ş/g, "s");
  textString = textString.replace(/ö/g, "o");
  textString = textString.replace(/Ö/g, "o");
  textString = textString.replace(/ç/g, "c");
  textString = textString.replace(/Ç/g, "c");
  textString = textString.replace(/–/g, "-");
  textString = textString.replace(/—/g, "-");
  textString = textString.replace(/—-/g, "-");
  textString = textString.replace(/—-/g, "-");
  return textString
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-*/, "")
    .replace(/-*$/, "");
};

const func = {
  getDiscount,
  filter_array_in_obj,
  search_array_object_tree,
  replaceUrlPermissions,
  getCategoriesTree,
  selectCategoriesFilterData,
  getCategoriesTreeOptions,
  replaceSeoUrl,
};

export default func;
