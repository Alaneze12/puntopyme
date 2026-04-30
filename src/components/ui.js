export const card = {
  background: "#fff",
  borderRadius: 14,
  padding: 20,
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  border: "1px solid #eee"
};

export const input = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  marginRight: 10,
  fontSize: 14,
  transition: "0.2s",
};

export const button = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(135deg, #6c5ce7, #8e7dff)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "500",
  transition: "0.2s",
};

export const buttonDanger = {
  ...button,
  background: "#ff4d4f"
};

export const buttonSecondary = {
  ...button,
  background: "#636e72"
};