import { createUnitOfWork } from "@app/core/uow";
import { ProductsRepository } from "@app/repositories/productsRepository";
import { ProductsService } from "@app/services/productsService";
import { CategoriesRepository } from "@app/repositories/categoriesRepository";
import { CategoriesService } from "@app/services/categoriesService";
import { BrandsRepository } from "@app/repositories/brandsRepository";
import { BrandsService } from "@app/services/brandsService";
import { OrdersRepository } from "@app/repositories/ordersRepository";
import { OrdersService } from "@app/services/ordersService";
import { CustomersRepository } from "@app/repositories/customersRepository";
import { CustomersService } from "@app/services/customersService";
import { StaffRepository } from "@app/repositories/staffRepository";
import { StaffService } from "@app/services/staffService";
import { PaymentmethodsRepository } from "@app/repositories/paymentmethodsRepository";
import { PaymentmethodsService } from "@app/services/paymentmethodsService";
import { OrderstatusRepository } from "@app/repositories/orderstatusRepository";
import { OrderstatusService } from "@app/services/orderstatusService";
import { CargoesRepository } from "@app/repositories/cargoesRepository";
import { CargoesService } from "@app/services/cargoesService";
import { TopmenuRepository } from "@app/repositories/topmenuRepository";
import { TopmenuService } from "@app/services/topmenuService";
import { VariantsRepository } from "@app/repositories/variantsRepository";
import { VariantsService } from "@app/services/variantsService";
import { SettingsRepository } from "@app/repositories/settingsRepository";
import { SettingsService } from "@app/services/settingsService";
import { HomesliderRepository } from "@app/repositories/homesliderRepository";
import { HomesliderService } from "@app/services/homesliderService";
import { TurkeyRepository } from "@app/repositories/turkeyRepository";
import { TurkeyService } from "@app/services/turkeyService";
import { ProductimagesRepository } from "@app/repositories/productimagesRepository";
import { ProductimagesService } from "@app/services/productimagesService";
import { CountryRepository } from "@app/repositories/countryRepository";
import { CountryService } from "@app/services/countryService";
import { BasketRepository } from "@app/repositories/basketRepository";
import { BasketService } from "@app/services/basketService";
import { UsersRepository } from "@app/repositories/usersRepository";
import { UsersService } from "@app/services/usersService";
import { UploadService } from "@app/services/uploadService";
import { PublicCatalogService } from "@app/services/publicCatalogService";
import { PublicProductsService } from "@app/services/publicProductsService";
import { PaymentService } from "@app/services/paymentService";
import { SearchService } from "@app/services/searchService";

const getUnitOfWork = async () => createUnitOfWork();

const getSearchService = (): SearchService => {
  return new SearchService();
};

const getProductsService = (): ProductsService => {
  const repository = new ProductsRepository();
  return new ProductsService(repository, getSearchService());
};

const getCategoriesService = (): CategoriesService => {
  const repository = new CategoriesRepository();
  return new CategoriesService(repository, getSearchService());
};

const getBrandsService = (): BrandsService => {
  const repository = new BrandsRepository();
  return new BrandsService(repository, getSearchService());
};

const getOrdersService = (): OrdersService => {
  const repository = new OrdersRepository();
  return new OrdersService(repository);
};

const getCustomersService = (): CustomersService => {
  const repository = new CustomersRepository();
  return new CustomersService(repository);
};

const getStaffService = (): StaffService => {
  const repository = new StaffRepository();
  return new StaffService(repository);
};

const getPaymentmethodsService = (): PaymentmethodsService => {
  const repository = new PaymentmethodsRepository();
  return new PaymentmethodsService(repository);
};

const getOrderstatusService = (): OrderstatusService => {
  const repository = new OrderstatusRepository();
  return new OrderstatusService(repository);
};

const getCargoesService = (): CargoesService => {
  const repository = new CargoesRepository();
  return new CargoesService(repository);
};

const getTopmenuService = (): TopmenuService => {
  const repository = new TopmenuRepository();
  return new TopmenuService(repository);
};

const getVariantsService = (): VariantsService => {
  const repository = new VariantsRepository();
  return new VariantsService(repository);
};

const getSettingsService = (): SettingsService => {
  const repository = new SettingsRepository();
  return new SettingsService(repository);
};

const getHomesliderService = (): HomesliderService => {
  const repository = new HomesliderRepository();
  return new HomesliderService(repository);
};

const getTurkeyService = (): TurkeyService => {
  const repository = new TurkeyRepository();
  return new TurkeyService(repository);
};

const getProductimagesService = (): ProductimagesService => {
  const repository = new ProductimagesRepository();
  return new ProductimagesService(repository);
};

const getCountryService = (): CountryService => {
  const repository = new CountryRepository();
  return new CountryService(repository);
};

const getBasketService = (): BasketService => {
  const basketRepository = new BasketRepository();
  const productsRepository = new ProductsRepository();
  return new BasketService(basketRepository, productsRepository);
};

const getUsersService = (): UsersService => {
  const repository = new UsersRepository();
  return new UsersService(repository);
};

const getUploadService = (): UploadService => new UploadService();
const getPublicCatalogService = (): PublicCatalogService =>
  new PublicCatalogService(getSearchService());
const getPublicProductsService = (): PublicProductsService =>
  new PublicProductsService(getSearchService());
const getPaymentService = (): PaymentService => {
  return new PaymentService(
    new PaymentmethodsRepository(),
    new ProductsRepository(),
    new CargoesRepository(),
    new OrdersRepository()
  );
};

export {
  getUnitOfWork,
  getSearchService,
  getProductsService,
  getCategoriesService,
  getBrandsService,
  getOrdersService,
  getCustomersService,
  getStaffService,
  getPaymentmethodsService,
  getOrderstatusService,
  getCargoesService,
  getTopmenuService,
  getVariantsService,
  getSettingsService,
  getHomesliderService,
  getTurkeyService,
  getProductimagesService,
  getCountryService,
  getBasketService,
  getUsersService,
  getUploadService,
  getPublicCatalogService,
  getPublicProductsService,
  getPaymentService,
};
