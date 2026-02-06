export type TopMenuItem = {
  _id?: string;
  categories_id?: string;
  order?: number;
  title?: string;
  description_short?: string;
  description?: string;
  seo?: string;
  link?: string;
  isActive?: boolean;
  visible?: boolean;
  children?: TopMenuItem[] | unknown;
};

export type TopMenuFormValues = {
  categories_id?: string;
  order?: number;
  title?: string;
  description_short?: string;
  description?: string;
  seo?: string;
  link?: string;
  visible?: boolean;
  created_user?: { name?: string; id?: string };
};

export type TopMenuTreeOption = {
  label?: string;
  value?: string;
  children?: TopMenuTreeOption[];
};

export type FormFieldData = {
  name: string | number | (string | number)[];
  value?: unknown;
};

export type TopMenuAddProps = {
  getCategories?: TopMenuTreeOption[];
};

export type TopMenuEditProps = {
  getData?: TopMenuItem;
  getCategories?: TopMenuTreeOption[];
};

export type TopMenuListProps = {
  getData?: TopMenuItem[];
};
