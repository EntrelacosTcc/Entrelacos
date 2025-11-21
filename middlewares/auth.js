// middlewares/auth.js
const admin = require('firebase-admin');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // contains uid, email, etc.
    req.userId = decoded.uid;
    next();
  } catch (err) {
    console.error('Firebase auth error:', err);
    return res.status(401).json({ error: 'Token inválido' });
  }
};
