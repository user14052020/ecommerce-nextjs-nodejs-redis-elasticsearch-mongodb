import func from "@root/shared/lib/helpers/func";
import type { BasketProduct, ProductData, VariantProduct } from "@app/entities/basket/model/types";

type BasketTotals = {
  total: number;
  discount: number;
  errorFlags: boolean[];
  errorMessages: Array<string | null>;
};

const getErrorMessage = (
  record: ProductData,
  product: BasketProduct
): string | null => {
  if (product.selectedVariants !== undefined) {
    const priceMath = func.filter_array_in_obj(
      record.variant_products ?? [],
      product.selectedVariants
    ) as VariantProduct[];
    const variant = priceMath[0];

    if (variant?.visible === false) {
      return "Product Not Active";
    }
    if (Number(variant?.qty) < Number(product.qty)) {
      return "Product Not in Stock";
    }
    return null;
  }

  if (record.isActive === false) {
    return "Product Not Active";
  }
  if (Number(record.qty) < Number(product.qty)) {
    return "Product Not in Stock";
  }
  return null;
};

export const calculateBasketTotals = (
  data: ProductData[] = [],
  products: BasketProduct[] = []
): BasketTotals => {
  let basketTotalPrice = 0;
  let basketTotalDiscountPrice = 0;
  const errorMessages: Array<string | null> = [];

  products.forEach((product) => {
    const record = data.find((item) => item._id === product.product_id);
    if (!record) {
      return;
    }

    const errorMessage = getErrorMessage(record, product);
    errorMessages.push(errorMessage);

    if (product.selectedVariants !== undefined) {
      const priceMath = func.filter_array_in_obj(
        record.variant_products ?? [],
        product.selectedVariants
      ) as VariantProduct[];
      const variant = priceMath[0];
      if (variant) {
        basketTotalPrice += product.qty * variant.price;
        basketTotalDiscountPrice += product.qty * variant.before_price;
      }
      return;
    }

    basketTotalPrice += product.qty * record.price;
    basketTotalDiscountPrice += product.qty * record.before_price;
  });

  return {
    total: basketTotalPrice,
    discount: basketTotalDiscountPrice,
    errorFlags: errorMessages.map(Boolean),
    errorMessages,
  };
};
