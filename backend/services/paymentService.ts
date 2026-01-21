import Stripe from "stripe";
import { ClientSession, Types } from "mongoose";
import { PaymentmethodsRepository } from "@app/repositories/paymentmethodsRepository";
import { ProductsRepository } from "@app/repositories/productsRepository";
import { CargoesRepository } from "@app/repositories/cargoesRepository";
import { OrdersRepository } from "@app/repositories/ordersRepository";
import type { ProductsDocument } from "@app/models/products.model";
import type { OrderProduct } from "@app/models/orders.model";

const STRIPE_API_VERSION: Stripe.LatestApiVersion = "2020-08-27";

type BasketItem = {
  product_id: string;
  qty: number;
  selectedVariants?: Record<string, unknown>;
};

type BasketAddress = {
  address: string;
  village_id?: string;
  district_id?: string;
  town_id?: string;
  city_id?: string;
};

type BasketPayload = {
  created_user?: Record<string, unknown>;
  customer_id?: string | null;
  receiver_name?: string;
  receiver_email?: string;
  receiver_phone?: string;
  cargoes_id?: string | null;
  total_price?: number;
  total_discount?: number;
  cargo_price?: number;
  cargo_price_discount?: number;
  products: unknown[];
  orderstatus_id?: string;
  paymentmethods_id?: string;
  shipping_address?: BasketAddress;
  billing_address?: BasketAddress;
};

type CreatePaymentBody = {
  ids: string[];
  items: BasketItem[];
  cargoes_id?: string;
};

class PaymentService {
  private paymentmethodsRepository: PaymentmethodsRepository;
  private productsRepository: ProductsRepository;
  private cargoesRepository: CargoesRepository;
  private ordersRepository: OrdersRepository;

  constructor(
    paymentmethodsRepository: PaymentmethodsRepository,
    productsRepository: ProductsRepository,
    cargoesRepository: CargoesRepository,
    ordersRepository: OrdersRepository
  ) {
    this.paymentmethodsRepository = paymentmethodsRepository;
    this.productsRepository = productsRepository;
    this.cargoesRepository = cargoesRepository;
    this.ordersRepository = ordersRepository;
  }

  filterArrayInObj<T extends Record<string, unknown>>(
    arr: T[],
    criteria: Record<string, unknown>
  ) {
    return arr.filter((obj) => {
      return Object.keys(criteria).every((c) => obj[c] === criteria[c]);
    });
  }

  async calculateCargoes(cargoesId?: string) {
    if (!cargoesId) {
      return 0;
    }
    const cargoPrice = await this.cargoesRepository.findAll({
      _id: cargoesId,
    });
    return cargoPrice[0] ? cargoPrice[0].price : 0;
  }

  async calculateOrderAmount(ids: string[], items: BasketItem[]) {
    const products = await this.productsRepository.findAll({ _id: ids });
    let basketTotalPrice = 0;

    items.forEach((item) => {
      const product = products.find((val) => `${val._id}` === `${item.product_id}`);
      if (!product) {
        return;
      }
      if (item.selectedVariants !== undefined) {
        const priceMath = this.filterArrayInObj(
          (product.variant_products || []) as Record<string, unknown>[],
          item.selectedVariants
        );
        const price = Number((priceMath[0] as { price?: number })?.price || 0);
        basketTotalPrice += item.qty * price;
      } else {
        basketTotalPrice += item.qty * Number(product.price || 0);
      }
    });

    return basketTotalPrice;
  }

  async updateProductSaleqty(id: string, qty: number, session?: ClientSession) {
    await this.productsRepository.updateOne(
      { _id: id },
      { $inc: { saleqty: qty } },
      session ? { session } : undefined
    );
  }

  async updateProductQtyNormal(id: string, qty: number, session?: ClientSession) {
    await this.productsRepository.updateOne(
      { _id: id },
      { $inc: { qty: -qty } },
      session ? { session } : undefined
    );
  }

  async updateProductQtyVariant(
    id: string,
    variants: Record<string, unknown>,
    qty: number,
    session?: ClientSession
  ) {
    await this.productsRepository.updateOne(
      {
        $and: [{ _id: id }, { variant_products: { $elemMatch: variants } }],
      },
      {
        $inc: {
          "variant_products.$.saleqty": qty,
          "variant_products.$.qty": -qty,
        },
      },
      session ? { session } : undefined
    );
  }

  async createOrderFromBasket(
    products: ProductsDocument[],
    items: BasketItem[],
    basket: BasketPayload[],
    session?: ClientSession
  ) {
    const basketAllProducts: Record<string, unknown>[] = [];

    for (const item of items) {
      await this.updateProductSaleqty(item.product_id, item.qty, session);
      const product = products.find((val) => `${val._id}` === `${item.product_id}`);
      if (!product) {
        continue;
      }
      const errorArray: string[] = [];
      if (item.selectedVariants !== undefined) {
        const priceMath = this.filterArrayInObj(
          (product.variant_products || []) as Record<string, unknown>[],
          item.selectedVariants
        );
        await this.updateProductQtyVariant(
          item.product_id,
          item.selectedVariants,
          item.qty,
          session
        );
        const variant = priceMath[0] as {
          price?: number;
          before_price?: number;
        };
        const price = Number(variant?.price || 0);
        const beforePrice = Number(variant?.before_price || 0);
        basketAllProducts.push({
          _id: product._id,
          title: product.title,
          selectedVariants: item.selectedVariants,
          qty: item.qty,
          price,
          before_price: beforePrice,
          total_price: item.qty * price,
          total_discount: item.qty * beforePrice,
          error: errorArray,
          seo: product.seo,
        });
      } else {
        await this.updateProductQtyNormal(item.product_id, item.qty, session);
        const price = Number(product.price || 0);
        const beforePrice = Number(product.before_price || 0);
        basketAllProducts.push({
          _id: product._id,
          title: product.title,
          selectedVariants: item.selectedVariants,
          qty: item.qty,
          price,
          before_price: beforePrice,
          total_price: item.qty * price,
          total_discount: item.qty * beforePrice,
          error: errorArray,
          seo: product.seo,
        });
      }
    }

    const buildAddress = (address?: BasketAddress) => {
      if (!address) {
        return "";
      }
      return [
        address.address,
        address.village_id,
        address.district_id,
        address.town_id,
        address.city_id,
      ]
        .filter(Boolean)
        .join(" ");
    };

    const { total_discount, cargo_price_discount, ...rest } = basket[0];
    const customerId =
      typeof rest.customer_id === "string"
        ? new Types.ObjectId(rest.customer_id)
        : rest.customer_id;
    const paymentMethodId = new Types.ObjectId("6132787ae4c2740b7aff7320");
    const orderStatusId = new Types.ObjectId("6131278e07625b5635a8709f");
    const cargoId =
      typeof rest.cargoes_id === "string"
        ? new Types.ObjectId(rest.cargoes_id)
        : rest.cargoes_id;
    const orderPayload = {
      ...rest,
      customer_id: customerId,
      paymentmethods_id: paymentMethodId,
      orderstatus_id: orderStatusId,
      cargoes_id: cargoId,
      products: basketAllProducts as OrderProduct[],
      shipping_address: buildAddress(basket[0].shipping_address),
      billing_address: buildAddress(basket[0].billing_address),
      discount_price: Number(total_discount || 0),
      cargo_discount_price: Number(cargo_price_discount || 0),
    };

    const createdOrder = await this.ordersRepository.create(
      orderPayload,
      session ? { session } : undefined
    );
    return createdOrder;
  }

  async createOrderFromRequest(
    ids: Types.ObjectId[] | string[],
    items: BasketItem[],
    basket: BasketPayload[],
    session?: ClientSession
  ) {
    const products = await this.productsRepository.findAll({ _id: ids });
    return this.createOrderFromBasket(products, items, basket, session);
  }

  async createStripePayment(body: CreatePaymentBody) {
    const paymentMethod = await this.paymentmethodsRepository.findById(
      "6132787ae4c2740b7aff7320"
    );
    if (!paymentMethod || !paymentMethod.secret_key || body.items.length === 0) {
      return null;
    }
    const stripe = new Stripe(paymentMethod.secret_key, {
      apiVersion: STRIPE_API_VERSION,
    });
    const price = await this.calculateOrderAmount(body.ids, body.items);
    const cargoPrice = await this.calculateCargoes(body.cargoes_id);
    const totalPrice = Math.round((price + cargoPrice) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async confirmPayment(piKey: string) {
    const paymentMethod = await this.paymentmethodsRepository.findById(
      "6132787ae4c2740b7aff7320"
    );
    if (!paymentMethod || !paymentMethod.secret_key || !piKey) {
      return null;
    }
    const stripe = new Stripe(paymentMethod.secret_key, {
      apiVersion: STRIPE_API_VERSION,
    });
    return stripe.paymentIntents.retrieve(piKey);
  }

  async findOrderByPaymentIntent(params: Record<string, unknown>) {
    return this.ordersRepository.findAll(params);
  }
}

export { PaymentService };
