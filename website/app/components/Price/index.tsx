import { useSelector } from "react-redux";
import type { RootState } from "@app/redux/store";

type PriceProps = {
   data?: number;
};

const Default = ({ data = 0 }: PriceProps) => {
   const { settings } = useSelector((state: RootState) => state.settings);
   const priceIcon = typeof settings.price_icon === "string" ? settings.price_icon : "";
   const priceType = Boolean(settings.price_type);
   return (
      <>
         {priceType ? (
            <>
               {priceIcon}
               {data.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </>
         ) : (
            <>
               {data.toLocaleString(undefined, { minimumFractionDigits: 2 })}
               {priceIcon}
            </>
         )}
      </>
   );
};

export default Default;
