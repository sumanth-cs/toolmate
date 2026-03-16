import jwt from "jsonwebtoken";

const generateToken = (id) => {
  // For demo purposes, use a fallback secret if not in env
  const secret = process.env.JWT_SECRET || "fallback_secret_for_demo";
  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });
};

export default generateToken;
