import AuthControls from "@app/widgets/auth/AuthControls";
import BasketLink from "@app/entities/basket/ui/BasketLink";

const HeaderActions = () => {
  return (
    <div className=" mt-5   text-base text-right px-0 flex">
      <AuthControls />
      <BasketLink />
    </div>
  );
};

export default HeaderActions;
