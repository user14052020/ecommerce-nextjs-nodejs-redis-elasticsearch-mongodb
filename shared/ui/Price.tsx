type PriceProps = {
  value?: number;
  priceIcon?: string;
  priceType?: boolean;
};

const Price = ({ value = 0, priceIcon = "", priceType = false }: PriceProps) => {
  return (
    <>
      {priceType ? (
        <>
          {priceIcon}
          {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </>
      ) : (
        <>
          {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          {priceIcon}
        </>
      )}
    </>
  );
};

export default Price;
