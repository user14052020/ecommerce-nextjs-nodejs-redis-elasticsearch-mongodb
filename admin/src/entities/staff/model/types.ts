export type RoleMap = Record<string, boolean>;

export type StaffItem = {
  _id: string;
  name?: string;
  surname?: string;
  username?: string;
};

export type StaffState = {
  _id?: string;
  image?: string;
  password?: string;
  role: RoleMap;
};

export type StaffFormValues = {
  username?: string;
  password?: string;
  confirm?: string;
  name?: string;
  surname?: string;
  phone?: string;
  prefix?: string;
  role?: RoleMap | { empty: true };
  isCustomer?: boolean;
  image?: string;
  created_user?: { name?: string; id?: string };
};
