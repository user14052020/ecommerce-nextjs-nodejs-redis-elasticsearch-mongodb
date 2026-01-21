import type { Dispatch, SetStateAction } from "react";

type FieldData = {
   name: string | number | (string | number)[];
   value?: unknown;
};

type AddressEntry = {
   name?: string;
   address?: string;
   village_id?: string;
   town_id?: string;
   city_id?: string;
   country_id?: string;
   [key: string]: unknown;
};

type NewAddressState = {
   open: boolean;
   id: string | null;
};

type AddressSelectProps = {
   Data: AddressEntry;
   setFields: Dispatch<SetStateAction<FieldData[]>>;
   setNewAddress: Dispatch<SetStateAction<NewAddressState>>;
   newAddress: NewAddressState;
   onChanheShppingAddress?: (data: string) => void;
   selectedShippingAddress?: string | null;
   onChanheBillingAddress?: (data: string) => void;
   selectedBillingAddress?: string | null;
};

const Default = ({
   Data,
   setFields,
   setNewAddress,
   newAddress,
   onChanheShppingAddress,
   selectedShippingAddress,
   onChanheBillingAddress,
   selectedBillingAddress,
}: AddressSelectProps) => {
   return (
      <>
         <div className=" mb-5 mt-2">
            <span
               className="float-right font-xs p-2 cursor-pointer -mb-10 z-10 relative"
               onClick={() => {
                  setNewAddress({ id: JSON.stringify(Data), open: !newAddress.open });
                  setFields(
                     Object.entries(Data).map(([name, value]) => ({ name, value }))
                  );
               }}
            >
          Update
            </span>
            <button
               onClick={() => {
                  onChanheShppingAddress
                     ? onChanheShppingAddress(JSON.stringify(Data))
                     : null;
                  onChanheBillingAddress
                     ? onChanheBillingAddress(JSON.stringify(Data))
                     : null;
               }}
               className={`${
                  selectedShippingAddress == JSON.stringify(Data) ||
            selectedBillingAddress == JSON.stringify(Data)
                     ? "border-brand-color bg-red-50"
                     : ""
               }  border h-22 w-full bg-gray-50 focus:bg-red-50  focus:border-brand-color hover:bg-gray-100 rounded hover:shadow-sm hover:border-red-200 cursor-pointer text-left `}
            >
               <div className="border-b w-full p-2">
                  <span className="font-semibold w-full p-1">{Data.name}</span>
               </div>
               <div className="w-full  ">
                  <div className=" w-full float-left p-3 pb-0  "> {Data.address}</div>
                  <div className="flex w-full justify-between p-3 pt-1 ">
                     {Data.village_id}/{Data.town_id}/{Data.city_id}/{Data.country_id}
                  </div>
               </div>
            </button>
         </div>
      </>
   );
};

export default Default;
