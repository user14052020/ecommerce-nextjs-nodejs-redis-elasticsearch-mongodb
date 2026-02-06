import SearchBar from "@app/widgets/Header/ui/SearchBar";

const HeaderSearch = () => {
  return (
    <div className=" flex-auto  w-3/12 mr-3 md:w-auto md:mr-0    mt-6  px-0 sm:px-12">
      <SearchBar className="sm:px-10 " />
    </div>
  );
};

export default HeaderSearch;
