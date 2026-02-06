import { combineReducers } from "redux";
import Settings from "@app/entities/settings/model/reducer";
import Login from "@app/entities/user/model/reducer";
import Brands from "@app/entities/brands/model/reducer";
import FilterProducts from "@app/features/filter-products/model/reducer";
import Categories from "@app/entities/categories/model/reducer";
import Basket from "@app/entities/basket/model/reducer";
import Topmenu from "@app/entities/topmenu/model/reducer";

const reducers = combineReducers({
   settings: Settings,
   login: Login,
   brands: Brands,
   filterProducts: FilterProducts,
   categories: Categories,
   basket: Basket,
   topmenu: Topmenu,
});

export default reducers;
export type RootState = ReturnType<typeof reducers>;
