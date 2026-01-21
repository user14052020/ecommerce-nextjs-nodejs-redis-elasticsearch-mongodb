type GenericRecord = Record<string, unknown>;
type TreeNode<T> = T & { children: TreeNode<T>[] };
type TreeOptionNode<T> = T & {
  value: unknown;
  key: unknown;
  children: TreeOptionNode<T>[];
  disabled?: boolean;
};

const filter_array_in_obj = <T extends GenericRecord>(
  arr: T[],
  criteria: GenericRecord
): T[] => {
  return arr.filter(function (obj) {
    return Object.keys(criteria).every(function (c) {
      return obj[c] == criteria[c];
    });
  });
};

const replaceUrlPermissions = (data: string): string => {
  return data.replace("/", "").replace("[", "").replace("]", "");
};

const getCategoriesTree = <T extends GenericRecord>(data: T[]) => {
  const nest = (
    items: T[],
    _id: string | null = null,
    link = "categories_id"
  ): TreeNode<T>[] => {
    return items
      .filter((item) => item[link] === _id)
      .map((item) => ({ ...item, children: nest(items, item._id as string) }));
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
    return Object.keys(obj as GenericRecord).length ? obj : undefined;
  };
  return clean(nest(data));
};

const getCategoriesTreeOptions = <T extends GenericRecord>(
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
        children: nest(items, item._id as string),
        disabled:
          nest(items, item._id as string).length > 0 && option === true
            ? true
            : false,
      }));
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
    return Object.keys(obj as GenericRecord).length ? obj : undefined;
  };

  const firstdata = clean(nest(data));
  return firstdata;
};

const replaceSeoUrl = (textString: string): string => {
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
    .toString() // Convert to string
    .normalize("NFD") // Change diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove illegal characters
    .replace(/\s+/g, "-") // Change whitespace to dashes
    .toLowerCase() // Change to lowercase
    .replace(/&/g, "-and-") // Replace ampersand
    .replace(/[^a-z0-9\-]/g, "") // Remove anything that is not a letter, number or dash
    .replace(/-+/g, "-") // Remove duplicate dashes
    .replace(/^-*/, "") // Remove starting dashes
    .replace(/-*$/, ""); // Remove trailing dashes
};

export default {
  filter_array_in_obj,
  replaceUrlPermissions,
  getCategoriesTree,
  getCategoriesTreeOptions,
  replaceSeoUrl,
};
