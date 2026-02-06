import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { settings_r } from "@app/features/settings/model/actions";
import type { AppDispatch } from "@app/app/store/store";

export const useSettingsBootstrap = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(settings_r());
  }, [dispatch]);
};
