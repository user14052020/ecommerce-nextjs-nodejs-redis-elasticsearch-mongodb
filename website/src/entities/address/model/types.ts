import type { Dispatch, SetStateAction } from "react";
import type { FieldData } from "@root/shared/types/form";

export type AddressEntry = {
  name?: string;
  type?: boolean;
  address?: string;
  village_id?: string;
  town_id?: string;
  city_id?: string;
  country_id?: string;
  district_id?: string;
  [key: string]: unknown;
};

export type NewAddressState = {
  open: boolean;
  id: string | null;
};

export type AddressSelectProps = {
  Data: AddressEntry;
  setFields: Dispatch<SetStateAction<FieldData[]>>;
  setNewAddress: Dispatch<SetStateAction<NewAddressState>>;
  newAddress: NewAddressState;
  onChanheShppingAddress?: (data: string) => void;
  selectedShippingAddress?: string | null;
  onChanheBillingAddress?: (data: string) => void;
  selectedBillingAddress?: string | null;
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
