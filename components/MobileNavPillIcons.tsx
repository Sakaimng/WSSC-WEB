type IconProps = {
  className?: string;
};

export const NAV_PILL_ICON_CLASS = "mobile-nav-pill__icon";

const LINE_PROPS = {
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
};

export function NavFaviconW({ className = NAV_PILL_ICON_CLASS }: IconProps) {
  return (
    <svg
      viewBox="0 0 149 114"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M117.929 113.679H93.2679L74.14 36.3008H73.8239L55.0122 113.679H29.8773L0 0H24.8187L42.6819 77.378H42.9981L62.6001 0H85.838L105.124 78.3333H105.44L123.936 0H148.28L117.929 113.679Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function NavBurgerIcon({
  open,
  className = `${NAV_PILL_ICON_CLASS} mobile-nav-pill__icon--square`,
}: IconProps & { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`burger-icon ${open ? "burger-icon--open" : ""} ${className}`}
      aria-hidden
    >
      <g className="burger-icon__menu">
        <path d="M4 7H20" {...LINE_PROPS} />
        <path d="M4 12H20" {...LINE_PROPS} />
        <path d="M4 17H20" {...LINE_PROPS} />
      </g>
      <g className="burger-icon__close">
        <path d="M6 6L18 18" {...LINE_PROPS} />
        <path d="M18 6L6 18" {...LINE_PROPS} />
      </g>
    </svg>
  );
}

export function NavTicketIcon({
  className = `${NAV_PILL_ICON_CLASS} mobile-nav-pill__icon--square`,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M4 8.5C4 7.67 4.67 7 5.5 7H18.5C19.33 7 20 7.67 20 8.5V10C18.9 10 18 10.9 18 12C18 13.1 18.9 14 20 14V15.5C20 16.33 19.33 17 18.5 17H5.5C4.67 17 4 16.33 4 15.5V14C5.1 14 6 13.1 6 12C6 10.9 5.1 10 4 10V8.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}
