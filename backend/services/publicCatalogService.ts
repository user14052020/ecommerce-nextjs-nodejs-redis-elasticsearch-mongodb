import mongoose from "mongoose";
import Settings from "@app/models/settings.model";
import Topmenu from "@app/models/topmenu.model";
import Categories from "@app/models/categories.model";
import Brands from "@app/models/brands.model";
import Homeslider from "@app/models/homeslider.model";
import Cargoes from "@app/models/cargoes.model";
import Paymentmethods from "@app/models/paymentmethods.model";
import { withCache } from "@app/core/cache";
import { SearchService } from "@app/services/searchService";

const cacheKey = (suffix: string) => `public:catalog:${suffix}`;

class PublicCatalogService {
  private searchService?: SearchService;

  constructor(searchService?: SearchService) {
    this.searchService = searchService;
  }

  async getSettings() {
    return withCache(cacheKey("settings"), undefined, async () => {
      const data = await Settings.find();
      return data[0] || null;
    });
  }

  async getTopmenu(param: string) {
    return withCache(cacheKey(`topmenu:${param}`), undefined, async () => {
      if (param === "not") {
        return Topmenu.find(
          {},
          {
            title: 1,
            order: 1,
            seo: 1,
            link: 1,
            categories_id: 1,
            _id: 1,
            isActive: 1,
          }
        ).sort({ order: 1 });
      }
      return Topmenu.find({ seo: param }, {}).sort({ order: 1 });
    });
  }

  async getCategories(param: string) {
    return withCache(cacheKey(`categories:${param}`), undefined, async () => {
      if (param === "not") {
        return Categories.find();
      }
      return Categories.find({ isActive: param });
    });
  }

  async getBrands() {
    return withCache(cacheKey("brands"), undefined, async () => {
      return Brands.find(
        { isActive: true },
        { title: 1, image: 1, order: 1, _id: 1 }
      ).sort({ order: 1 });
    });
  }

  async getHomeslider() {
    return withCache(cacheKey("homeslider"), undefined, async () => {
      return Homeslider.find(
        { isActive: true },
        {
          title: 1,
          description: 1,
          link: 1,
          image: 1,
          _id: 1,
          categories_id: 1,
        }
      ).sort({ order: 1 });
    });
  }

  async getCargoes() {
    return withCache(cacheKey("cargoes"), undefined, async () => {
      return Cargoes.find(
        { isActive: true },
        { title: 1, order: 1, _id: 1, price: 1, before_price: 1 }
      ).sort({ order: 1 });
    });
  }

  async getPaymentmethods() {
    return withCache(cacheKey("paymentmethods"), undefined, async () => {
      return Paymentmethods.find(
        { isActive: true },
        { order: 1, title: 1, public_key: 1, contract: 1 }
      ).sort({ order: 1 });
    });
  }

  async getPaymentmethodById(id: string) {
    return withCache(cacheKey(`paymentmethods:${id}`), undefined, async () => {
      return Paymentmethods.find(
        { _id: id },
        { order: 1, title: 1, public_key: 1, contract: 1 }
      ).sort({ order: 1 });
    });
  }

  async searchCategories(query: string) {
    if (this.searchService?.isEnabled()) {
      const ids = await this.searchService.searchCategories(query);
      if (!ids.length) {
        return [];
      }
      const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));
      return Categories.find({ _id: { $in: objectIds }, isActive: true });
    }
    if (!query) {
      return Categories.find({ isActive: true });
    }
    return Categories.find({
      isActive: true,
      title: { $regex: query, $options: "i" },
    });
  }

  async searchBrands(query: string) {
    if (this.searchService?.isEnabled()) {
      const ids = await this.searchService.searchBrands(query);
      if (!ids.length) {
        return [];
      }
      const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));
      return Brands.find({ _id: { $in: objectIds }, isActive: true });
    }
    if (!query) {
      return Brands.find({ isActive: true });
    }
    return Brands.find({
      isActive: true,
      title: { $regex: query, $options: "i" },
    });
  }
}

export { PublicCatalogService };
