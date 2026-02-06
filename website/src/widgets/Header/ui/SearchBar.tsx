import { Input } from "antd";
import { useRouter } from "next/router";

export type SearchBarProps = {
  className?: string;
  placeholder?: string;
};

const SearchBar = ({ className = "", placeholder = "Search..." }: SearchBarProps) => {
  const router = useRouter();

  return (
    <Input.Search
      size="middle"
      placeholder={placeholder}
      enterButton
      className={className}
      onSearch={(val) => {
        if (typeof val === "string") {
          router.push(`/search?&text=${encodeURIComponent(val)}`);
        }
      }}
    />
  );
};

export default SearchBar;
