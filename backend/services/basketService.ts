import { ClientSession } from "mongoose";
import { ForbiddenError, NotFoundError } from "@app/core/errors";
import { BasketRepository } from "@app/repositories/basketRepository";
import { ProductsRepository } from "@app/repositories/productsRepository";
import { BasketDocument } from "@app/models/basket.model";
import { UsersDocument } from "@app/models/users.model";
import { FilterQuery } from "mongoose";
import { ProductsDocument } from "@app/models/products.model";

class BasketService {
  private basketRepository: BasketRepository;
  private productsRepository: ProductsRepository;

  constructor(
    basketRepository: BasketRepository,
    productsRepository: ProductsRepository
  ) {
    this.basketRepository = basketRepository;
    this.productsRepository = productsRepository;
  }

  ensureActive(user: UsersDocument) {
    if (!user.isActive) {
      throw new ForbiddenError("Your account not active!");
    }
  }

  async listBaskets(user: UsersDocument) {
    this.ensureActive(user);
    return this.basketRepository.findAll();
  }

  async listCustomerBasket(user: UsersDocument, customerId: string) {
    this.ensureActive(user);
    return this.basketRepository.findAll({ customer_id: customerId });
  }

  async getBasketById(user: UsersDocument, id: string) {
    this.ensureActive(user);
    const data = await this.basketRepository.findById(id);
    if (!data) {
      throw new NotFoundError("Basket not found");
    }
    return data;
  }

  async createBasket(
    user: UsersDocument,
    payload: Partial<BasketDocument>,
    session?: ClientSession
  ) {
    this.ensureActive(user);
    return this.basketRepository.create(
      payload,
      session ? { session } : undefined
    );
  }

  async updateBasket(
    user: UsersDocument,
    id: string,
    payload: Partial<BasketDocument>,
    session?: ClientSession
  ) {
    this.ensureActive(user);
    const updated = await this.basketRepository.updateById(
      id,
      payload,
      session ? { session } : undefined
    );
    if (!updated) {
      throw new NotFoundError("Basket not found");
    }
    return updated;
  }

  async deleteBasket(user: UsersDocument, id: string, session?: ClientSession) {
    const rolesControl = user.role || {};
    if (!rolesControl.basketdelete) {
      throw new ForbiddenError("Your account not active!");
    }
    const deleted = await this.basketRepository.deleteById(
      id,
      session ? { session } : undefined
    );
    if (!deleted) {
      throw new NotFoundError("Basket not found");
    }
    return deleted;
  }

  async listProductsByFilter(filter?: FilterQuery<ProductsDocument>) {
    return this.productsRepository.findAll(filter ?? {});
  }
}

export { BasketService };
