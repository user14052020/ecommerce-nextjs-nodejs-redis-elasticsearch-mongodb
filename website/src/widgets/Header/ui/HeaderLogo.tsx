import { useSelector } from "react-redux";
import Logo from "@app/shared/ui/Logo";
import { IMG_URL } from "@root/config";
import type { SettingsState } from "@root/shared/types/common";

const HeaderLogo = () => {
  const { settings } = useSelector(
    (state: { settings: SettingsState }) => state.settings
  );
  const image = typeof settings.image === "string" ? settings.image : "";

  return (
    <div className=" w-3/12 mr-3 md:w-2/12 md:mr-0  mt-4 md:mt-2 lg:mt-3">
      <Logo
        className=" w-full sm:w-10/12 sm:mt-0 mt-3  "
        src={`${IMG_URL}${image}`}
      />
    </div>
  );
};

export default HeaderLogo;
