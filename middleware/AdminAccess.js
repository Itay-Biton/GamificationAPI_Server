const checkAdminAccess = (req, res, next) => {
    const adminSecret = req.headers['admin-secret']
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Forbidden: Unauthorized access' })
    }
    next()
  }
  
  module.exports = checkAdminAccess