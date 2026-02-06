import type { BrandsActions } from "@app/entities/brands/model/types";
import type { CategoriesActions } from "@app/entities/categories/model/types";
import type { TopmenuActions } from "@app/entities/topmenu/model/types";
import type { FilterProductsActions } from "@app/features/filter-products/model/types";
import type { BasketActions } from "@app/entities/basket/model/types";
import type { LoginActions } from "@app/entities/user/model/types";
import type { SettingsActions } from "@app/entities/settings/model/types";

export type { GenericRecord, LanguageInfo, SettingsState } from "@root/shared/types/common";

export type AppActions =
  | SettingsActions
  | BrandsActions
  | CategoriesActions
  | TopmenuActions
  | FilterProductsActions
  | BasketActions
  | LoginActions;
