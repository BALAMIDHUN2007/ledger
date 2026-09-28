const Logo = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    role="img"
    aria-label="Ledger logo"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 8.5A4.5 4.5 0 0 1 14.5 4H38v31.5A4.5 4.5 0 0 0 33.5 31H10z" fill="currentColor" opacity=".22" />
    <path d="M10 8.5A4.5 4.5 0 0 1 14.5 4H38v31.5A4.5 4.5 0 0 0 33.5 31H10z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M10 8.5V40" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M18 13h13M18 19h13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="m19 27 3.5 3.5L29 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Logo;