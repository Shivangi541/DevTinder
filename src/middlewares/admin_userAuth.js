// middlewares/admin_userAuth.js
// ✅ CommonJS style (matches your require() call)

const adminAuth = (req, res, next) => {
  // Dummy check – replace with real admin validation
  const token = "xyz";
  const isAdmin = token === "xyz";
  if (!isAdmin) return res.status(403).send("Admins only 🔒");
  next();
};

const userAuth = (req, res, next) => {
  // Dummy check – replace with real user validation
  const token = "abc";
  const isUser = token === "abc";
  if (!isUser) return res.status(401).send("User not authenticated 🔒");
  next();
};

module.exports = { adminAuth, userAuth };
