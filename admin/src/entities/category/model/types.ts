export type CategoryItem = {
  _id: string;
  title?: string;
  order?: number;
  description?: string;
  categories_id?: string | null;
  seo?: string;
  link?: string;
  visible?: boolean;
  children?: CategoryItem[];
};

export type CategoryOption = {
  label?: string;
  title?: string;
  value?: string;
  children?: CategoryOption[];
};

export type CategoryFormValues = {
  categories_id?: string | null;
  order: number;
  title: string;
  description: string;
  seo?: string;
  link?: string;
  visible?: boolean;
  created_user?: { name?: string; id?: string };
};

export type CategoriesAddProps = {
  getCategories?: CategoryOption[];
};

export type CategoriesEditProps = {
  getData?: CategoryItem;
  getCategories?: CategoryOption[];
};

export type CategoriesListProps = {
  getData?: CategoryItem[];
};
