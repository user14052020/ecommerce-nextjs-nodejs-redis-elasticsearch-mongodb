import { useSelector } from "react-redux";
import type { RootState } from "@app/app/store/store";
import PriceView from "@root/shared/ui/Price";

type PriceProps = {
  data?: number;
};

const Price = ({ data = 0 }: PriceProps) => {
  const { settings } = useSelector((state: RootState) => state.settings);
  const priceIcon =
    typeof settings.price_icon === "string" ? settings.price_icon : "";
  const priceType = Boolean(settings.price_type);

  return <PriceView value={data} priceIcon={priceIcon} priceType={priceType} />;
};

export default Price;
