const Users = require('../users/users-model');

const checkUser = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || username === null || username === "" || !password || password === null || password === "") {
    res.status(500).json({ message: "username and password required" });
  }
  next();
}

// 3- On FAILED registration due to `username` or `password` missing from the request body,
// the response body should include a string exactly as follows: "username and password required".

// 4- On FAILED registration due to the `username` being taken,
// the response body should include a string exactly as follows: "username taken".

const checkUserExists = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || username === null || username === "" || !password || password === null || password === "") {
    res.status(500).json({ message: "username and password required" });
  }
  const [user] = await Users.findBy({username: req.body.username})
  if (!user) {
    next({ status: 422, message: "Invalid credentials" });
  } else {
    req.user = user;
    next();
  }
}

module.exports = {
  checkUserExists,
  checkUser,
}