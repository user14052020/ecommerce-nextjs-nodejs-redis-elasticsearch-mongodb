import HeaderActions from "@app/widgets/Header/ui/HeaderActions";
import HeaderLogo from "@app/widgets/Header/ui/HeaderLogo";
import HeaderSearch from "@app/widgets/Header/ui/HeaderSearch";

const Default = () => {
   return (
      <div className="w-full flex justify-between mb-3 ">
         <HeaderLogo />
         <HeaderSearch />
         <HeaderActions />
      </div>
   );
};

export default Default;
