export type VariantValue = {
  name?: string;
  value?: string;
};

export type VariantItem = {
  _id: string;
  name?: string;
  variants: VariantValue[];
};

export type VariantFormValues = {
  name?: string;
  description?: string;
  variants?: VariantValue[];
  created_user?: { name?: string; id?: string };
};
