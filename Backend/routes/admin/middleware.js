const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.adminToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No admin token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify it's an admin token
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid admin token' });
  }
};

module.exports = verifyAdmin;

