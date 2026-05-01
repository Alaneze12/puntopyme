import { useState } from "react";

export default function Button({
  children,
  onClick,
  variant = "primary",
  style = {},
  disabled = false
}) {
  const [hover, setHover] = useState(false);

  const getStyle = () => {
    const base = {
      padding: "11px 18px",
      borderRadius: 12,
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 600,
      fontSize: 14,
      transition: "all 0.2s ease",
      opacity: disabled ? 0.6 : 1,
    };

    const variants = {
      primary: {
        background: "linear-gradient(135deg, #5f66ff, #7c83ff)",
        color: "#fff",
      },
      danger: {
        background: "linear-gradient(135deg, #ff4d4f, #ff7875)",
        color: "#fff",
      },
      secondary: {
        background: "#2d3436",
        color: "#fff",
      }
    };

    return {
      ...base,
      ...variants[variant],
      ...(hover && !disabled ? { transform: "scale(0.97)", opacity: 0.9 } : {}),
      ...style
    };
  };

  return (
    <button
      style={getStyle()}
      onClick={disabled ? null : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
}