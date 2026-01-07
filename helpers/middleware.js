import admin from "./adminacc.js";

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    // 1. Read header
    const token = req.headers.authorization;
    console.log("AUTH HEADER:", token);

    if (!token) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // 2. Extract token
    // const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // 3. Verify token with Firebase Admin
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("DECODED TOKEN:", decoded);

    // 4. Attach user and continue
    req.user = decoded;
    next();
  } catch (err) {
    console.error("TOKEN VERIFY ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

