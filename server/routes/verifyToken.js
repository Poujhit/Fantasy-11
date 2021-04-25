const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('auth_Token');
  if (!token) return res.status(401).send("Access denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    const id = req.user._id;
    res.send(id);
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}