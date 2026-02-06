export type SelectOption = {
  label: string;
  value: string;
};

export type CountryState = {
  name: string;
};

export type CountryItem = {
  name: string;
  states?: CountryState[];
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

export type OptionData<T> = {
  option: SelectOption[];
  data: T[];
};

export type SelectedAddressState = {
  selectedCountry?: string;
  selectedCity?: string;
  selectedIlce?: string;
  selectedSemt?: string;
  selectedMahalle?: string;
};

export type CustomerAddress = {
  type?: boolean;
  name?: string;
  country_id?: string;
  state_id?: string;
  city_id?: string;
  town_id?: string;
  district_id?: string;
  village_id?: string;
  address?: string;
};

export type CustomerFormValues = {
  username?: string;
  name?: string;
  surname?: string;
  password?: string;
  confirm?: string;
  phone?: string;
  prefix?: string;
  address?: CustomerAddress[];
  created_user?: { name?: string; id?: string };
};

export type CustomerData = CustomerFormValues & {
  _id?: string;
};

export type CustomerItem = {
  _id: string;
  name?: string;
  surname?: string;
  username?: string;
  isActive?: boolean;
};

export type CustomersAddProps = {
  dataCityOption?: SelectOption[];
  dataCity?: TurkeyCity[];
};

export type CustomersEditProps = {
  dataCityOption?: SelectOption[];
  dataCity?: TurkeyCity[];
  getData?: CustomerData;
};

export type CustomersListProps = {
  getData?: CustomerItem[];
};
