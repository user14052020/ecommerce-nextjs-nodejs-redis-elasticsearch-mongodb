export type LogoProps = {
  className?: string;
  href?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  src: string;
};

const Logo = ({
  className = "",
  href = "/",
  width = 169,
  height = 44,
  alt = "Logo",
  src,
}: LogoProps) => {
  return (
    <a href={href}>
      <img
        src={src}
        width={width}
        height={height}
        className={className}
        alt={alt}
      />
    </a>
  );
};

export default Logo;
