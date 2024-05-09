import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // Nota que 'authorization' debe ser minúscula
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.sendStatus(401); // Si no tiene el formato esperado, devolver 401
  }
  const token = authHeader.split(" ")[1]; // Obtener el token después de "Bearer "
  if (token.split(".").length !== 3) {
    console.error("JWT format error: The token does not have three parts.");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  });
}

export { authenticateToken };
