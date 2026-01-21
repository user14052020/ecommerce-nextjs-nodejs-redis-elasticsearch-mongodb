import { useEffect, useState } from "react";
import { Button, Form, Input, message, Select, Drawer } from "antd";
import { useIntl } from "react-intl";

import AddressSelect from "@app/app/components/Basket/AddressSelect";
import { useSelector } from "react-redux";
import { API_URL } from "@root/config";

import AuthService from "@app/util/services/authservice";
import axios from "axios";
import type { RootState } from "@app/redux/store";

type FieldData = {
   name: string | number | (string | number)[];
   value?: unknown;
};

type AddressEntry = {
   name?: string;
   address?: string;
   country_id?: string;
   city_id?: string;
   town_id?: string;
   village_id?: string;
   district_id?: string;
   [key: string]: unknown;
};

type NewAddressState = {
   open: boolean;
   id: string | null;
};

type OptionItem = {
   label: string;
   value: string;
};

type TurkeyMahalle = {
   Mahalle: string;
};

type TurkeySemt = {
   Semt: string;
   Mahalle: TurkeyMahalle[];
};

type TurkeyIlce = {
   Ilce: string;
   Semt: TurkeySemt[];
};

type TurkeyCity = {
   Il: string;
   Ilce: TurkeyIlce[];
};

type CountryItem = {
   name: string;
   states: { name: string }[];
};

type OptionWithData<T> = {
   option: OptionItem[];
   data: T[];
};

type SelectedOptions = {
   selectedCountry?: string;
   selectedCity?: string;
   selectedIlce?: string;
   selectedSemt?: string;
   selectedMahalle?: string;
};

const Defaut = () => {
   const intl = useIntl();
   const { isAuthenticated, user } = useSelector((state: RootState) => state.login);

   const buildFields = (data: Record<string, unknown>): FieldData[] =>
      Object.entries(data).map(([name, value]) => ({ name, value }));

   const [fields, setFields] = useState<FieldData[]>([]);
   const [address, setAddress] = useState<AddressEntry[]>([]);
   const [newAddress, setNewAddress] = useState<NewAddressState>({
      open: false,
      id: null,
   });
   const [city, setCity] = useState<TurkeyCity[]>([]);
   const [country, setCountry] = useState<CountryItem[]>([]);
   const [selectedO, setSelectedO] = useState<SelectedOptions>({});
   const [cityOption, setCityOption] = useState<OptionItem[]>([]);
   const [countryOption, setCountryOption] = useState<OptionItem[]>([]);
   const [ilceOption, setIlceOption] = useState<OptionWithData<TurkeyIlce>>({
      option: [],
      data: [],
   });
   const [semtOption, setSemtOption] = useState<OptionWithData<TurkeySemt>>({
      option: [],
      data: [],
   });
   const [mahalleOption, setMahalleOption] = useState<
      OptionWithData<TurkeyMahalle>
   >({
      option: [],
      data: [],
   });

   function getDataFc() {
      if (typeof user.id === "string") {
         axios.get(`${API_URL}/customers/${user.id}`).then((res) => {
            const data = res.data;
            data["password"] = "";
            const addressValue = Array.isArray(data.address)
               ? data.address
               : data.address
               ? [data.address]
               : [];
            const firstAddress = addressValue[0] || {};
            setFields(buildFields(firstAddress));
            setAddress(addressValue);
         });
      }
   }
   useEffect(() => {
      getDataFc();
      getCountry();
      getCity();
   }, [user]);

   const getCity = () => {
      axios.get<TurkeyCity[]>(`${API_URL}/turkey`).then((getData) => {
         const dataManipulate: OptionItem[] = [];
         for (const i in getData.data) {
            dataManipulate.push({
               label: getData.data[i].Il,
               value: getData.data[i].Il,
            });
         }
         setCityOption(dataManipulate);
         setCity(getData.data);
      });
   };

   const getCountry = () => {
      axios.get<CountryItem[]>(`${API_URL}/country`).then((getData) => {
         const dataManipulate: OptionItem[] = [];
         for (const i in getData.data) {
            dataManipulate.push({
               label: getData.data[i].name,
               value: getData.data[i].name,
            });
         }
         setCountryOption(dataManipulate);
         setCountry(getData.data);
      });
   };

   const getAddress = () => {
      if (isAuthenticated) {
         AuthService.isAuthenticated().then(async (auth) => {
            const authAddress = Array.isArray(auth.user.address)
               ? auth.user.address
               : auth.user.address
               ? [auth.user.address]
               : [];
            await setAddress(authAddress as AddressEntry[]);
         });
      }
   };

   const onSubmitAddress = async (Data: AddressEntry) => {
      if (newAddress.id) {
         const newAddresArr = address.filter(
            (x) => JSON.stringify(x) !== newAddress.id
         );
         newAddresArr.push(Data);
         newAddresArr.reverse();

         if (isAuthenticated) {
            await axios
               .post(`${API_URL}/customerspublic/address`, newAddresArr)
               .then(() => {
                  getAddress();
                  setNewAddress({ open: false, id: null });
               })
               .catch((err) => console.log("err", err));
         } else {
            message.success({ content: "Next Stage :)", duration: 3 });
            setNewAddress({ open: false, id: null });
            setAddress(newAddresArr);
         }
      } else {
         const newAddresArr = [...address];
         newAddresArr.push(Data);
         newAddresArr.reverse();

         axios
            .post(`${API_URL}/customerspublic/address`, newAddresArr)
            .then(() => {
               setTimeout(() => {
                  getAddress();
                  setNewAddress({ open: false, id: null });
               }, 500);
            })
            .catch((err) => console.log("err", err));
      }
   };

   return (
      <div className="w-full">
         <Button
            className="float-left font-semibold text-sm w-full py-7 text-center h-auto   mb-5 "
            onClick={() => {
               const firstAddress = address[0] ? address[0] : {};
               setFields(
                  Object.entries(firstAddress).map(([name]) => ({
                     name,
                     value: null,
                  }))
               );
               setNewAddress({ ...newAddress, open: !newAddress.open });
            }}
         >
        New Address
         </Button>
         {address &&
        address.map((x, i) => (
           <AddressSelect
              key={i}
              Data={x}
              setNewAddress={setNewAddress}
              setFields={setFields}
              newAddress={newAddress}
           />
        ))}

         <Drawer
            title="Address"
            placement="right"
            onClose={() => {
               setNewAddress({ ...newAddress, open: !newAddress.open });
            }}
            visible={newAddress.open}
         >
            <Form
               onFinish={onSubmitAddress}
               fields={fields}
               scrollToFirstError
               layout="vertical"
            >
               <Form.Item
                  className="float-left  w-full mx-0 px-0"
                  name="name"
                  label={intl.messages["app.pages.customers.addressName"]}
                  fieldKey="name"
                  rules={[{ required: true, message: "Missing Area" }]}
               >
                  <Input autoComplete="chrome-off" />
               </Form.Item>

               <Form.Item
                  name="type"
                  className="float-left  w-full  mx-0 px-0"
                  label="Type"
                  fieldKey="type"
               >
                  <Select
                     defaultValue={true}
                     options={[
                        { label: "Billing Address", value: true },
                        { label: "Shipping Address", value: false },
                     ]}
                     placeholder="Select Address Type"
                  />
               </Form.Item>

               <Form.Item
                  name="country_id"
                  className="float-left  w-full  mx-0 px-0"
                  label="Country"
                  fieldKey="country_id"
               >
                  <Select
                     showSearch
                     options={countryOption}
                     placeholder="Search to Country"
                     optionFilterProp="children"
                     filterOption={(input, option) => {
                        const label =
                           typeof option === "object" &&
                           option &&
                           "label" in option &&
                           typeof (option as { label?: unknown }).label === "string"
                              ? (option as { label: string }).label
                              : "";
                        return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                     }}
                     onChange={(selected: string) => {
                        if (selected == "Turkey") {
                           getCity();
                        } else {
                           const citydata = country.filter((x) => x.name === selected);
                           const dataManipulate: OptionItem[] = [];

                           for (const i in citydata[0].states) {
                              dataManipulate.push({
                                 label: citydata[0].states[i].name,
                                 value: citydata[0].states[i].name,
                              });
                           }

                           setCityOption(dataManipulate);
                        }
                        setSelectedO({ ...selectedO, selectedCountry: selected });
                     }}
                  />
               </Form.Item>

               <Form.Item
                  className="float-left w-full  mx-0 px-0"
                  name="city_id"
                  fieldKey="city_id"
                  label="City"
                  rules={[{ required: true, message: "Missing Area" }]}
               >
                  <Select
                     showSearch
                     options={cityOption}
                     placeholder={intl.messages["app.pages.customers.addressCity"]}
                     optionFilterProp="children"
                     filterOption={(input, option) =>
                        (typeof option === "object" &&
                        option &&
                        "label" in option &&
                        typeof (option as { label?: unknown }).label === "string"
                           ? (option as { label: string }).label
                           : ""
                        ).toLowerCase().indexOf(input.toLowerCase()) >= 0
                     }
                     onChange={(selected: string) => {
                        if (selectedO.selectedCountry == "Turkey") {
                           const ilce = city.filter((x) => x.Il === selected);
                           const dataManipulate: OptionItem[] = [];
                           for (const i in ilce[0].Ilce) {
                              dataManipulate.push({
                                 label: ilce[0].Ilce[i].Ilce,
                                 value: ilce[0].Ilce[i].Ilce,
                              });
                           }
                           setSelectedO({ ...selectedO, selectedCity: selected });
                           setIlceOption({ option: dataManipulate, data: ilce[0].Ilce });
                        }
                     }}
                  />
               </Form.Item>

               <Form.Item
                  className="float-left w-full  mx-0 px-0"
                  name="town_id"
                  label="Town"
                  fieldKey="town_id"
                  rules={[{ required: true, message: "Missing Area" }]}
               >
                  {selectedO.selectedCountry == "Turkey" ? (
                     <Select
                        showSearch
                        options={ilceOption.option}
                        placeholder={intl.messages["app.pages.customers.addressTown"]}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                           (typeof option === "object" &&
                           option &&
                           "label" in option &&
                           typeof (option as { label?: unknown }).label === "string"
                              ? (option as { label: string }).label
                              : ""
                           ).toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(selected: string) => {
                           const data = ilceOption.data.filter(
                              (x) => x.Ilce === selected
                           );
                           const dataManipulate: OptionItem[] = [];
                           for (const i in data[0].Semt) {
                              dataManipulate.push({
                                 label: data[0].Semt[i].Semt,
                                 value: data[0].Semt[i].Semt,
                              });
                           }
                           setSelectedO({ ...selectedO, selectedIlce: selected });
                           setSemtOption({ option: dataManipulate, data: data[0].Semt });
                        }}
                     />
                  ) : (
                     <Input
                        placeholder={intl.messages["app.pages.customers.addressTown"]}
                        autoComplete="chrome-off"
                     />
                  )}
               </Form.Item>

               <Form.Item
                  className="float-left w-full  mx-0 px-0"
                  name="district_id"
                  label="District"
                  fieldKey="district_id"
                  rules={[{ required: true, message: "Missing Area" }]}
               >
                  {selectedO.selectedCountry == "Turkey" ? (
                     <Select
                        showSearch
                        options={semtOption.option}
                        placeholder={
                           intl.messages["app.pages.customers.addressDistrict"]
                        }
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                           (typeof option === "object" &&
                           option &&
                           "label" in option &&
                           typeof (option as { label?: unknown }).label === "string"
                              ? (option as { label: string }).label
                              : ""
                           ).toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(selected: string) => {
                           const data = semtOption.data.filter(
                              (x) => x.Semt === selected
                           );
                           const dataManipulate: OptionItem[] = [];
                           for (const i in data[0].Mahalle) {
                              dataManipulate.push({
                                 label: data[0].Mahalle[i].Mahalle,
                                 value: data[0].Mahalle[i].Mahalle,
                              });
                           }
                           setSelectedO({ ...selectedO, selectedSemt: selected });
                           setMahalleOption({
                              option: dataManipulate,
                              data: data[0].Mahalle,
                           });
                        }}
                     />
                  ) : (
                     <Input
                        placeholder={
                           intl.messages["app.pages.customers.addressDistrict"]
                        }
                        autoComplete="chrome-off"
                     />
                  )}
               </Form.Item>

               <Form.Item
                  name="village_id"
                  className="float-left w-full  mx-0 px-0"
                  label="Village"
                  fieldKey="village_id"
                  rules={[{ required: true, message: "Missing Area" }]}
               >
                  {selectedO.selectedCountry == "Turkey" ? (
                     <Select
                        showSearch
                        options={mahalleOption.option}
                        placeholder={
                           intl.messages["app.pages.customers.addressNeighbour"]
                        }
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                           (typeof option === "object" &&
                           option &&
                           "label" in option &&
                           typeof (option as { label?: unknown }).label === "string"
                              ? (option as { label: string }).label
                              : ""
                           ).toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(selected: string) => {
                           setSelectedO({ ...selectedO, selectedMahalle: selected });
                        }}
                     />
                  ) : (
                     <Input
                        placeholder={
                           intl.messages["app.pages.customers.addressNeighbour"]
                        }
                        autoComplete="chrome-off"
                     />
                  )}
               </Form.Item>
               <Form.Item
                  className="float-left w-full  mx-0 px-0"
                  name="address"
                  label="Address"
                  fieldKey="address"
                  rules={[{ required: true, message: "Missing Area" }]}
               >
                  <Input.TextArea
                     rows={3}
                     placeholder={intl.messages["app.pages.customers.addressFull"]}
                     autoComplete="chrome-off"
                  />
               </Form.Item>
               <Button htmlType="submit" className="w-full p-3 h-auto">
            Save
               </Button>
            </Form>
         </Drawer>
      </div>
   );
};

export default Defaut;
