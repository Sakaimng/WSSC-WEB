import Image from "next/image";

type Props = {
  className?: string;
  priority?: boolean;
};

export function WsscLogo({ className = "h-8 w-auto sm:h-9", priority }: Props) {
  return (
    <Image
      src="/brand/wssc-logo.svg"
      alt="Why So Serious Comedy"
      width={4122}
      height={272}
      className={className}
      priority={priority}
    />
  );
}
