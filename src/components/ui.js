export const card = {
  background: "#ffffff",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  border: "1px solid rgba(0,0,0,0.04)",
  transition: "all 0.2s ease",
};

/* INPUT PRO */
export const input = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #e0e0e0",
  outline: "none",
  fontSize: 14,
  transition: "all 0.2s ease",
  width: "100%",
  boxSizing: "border-box",
};

/* BOTON BASE */
export const button = {
  padding: "11px 18px",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, #5f66ff, #7c83ff)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
  transition: "all 0.2s ease",
};

/* VARIANTES */
export const buttonDanger = {
  ...button,
  background: "linear-gradient(135deg, #ff4d4f, #ff7875)",
};

export const buttonSecondary = {
  ...button,
  background: "#2d3436",
};