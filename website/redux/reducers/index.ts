import { combineReducers } from "redux";
import Settings from "@app/redux/reducers/Settings";
import Login from "@app/redux/reducers/Login";
import Brands from "@app/redux/reducers/Brands";
import FilterProducts from "@app/redux/reducers/FilterProducts";
import Categories from "@app/redux/reducers/Categories";
import Basket from "@app/redux/reducers/Basket";
import Topmenu from "@app/redux/reducers/Topmenu";

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
