const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("./auth-helper");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  const user = req.body;
  if (user.username && user.password) {
    const hash = bcrypt.hashSync(user.password, 12)
    user.password = hash


    db.register(user)
      .then((user) => {
        if (user) {
          let token = generateToken(user);
          res.status(201).json({ user, token }).end();
        } else {
          res.status(400).json({ message: "There has been an error" }).end();
        }
      })
      .catch((err) => res.status(500).json(err).end());
  } else {
    res.status(400).json({ message: "Please fill out all fields" }).end();
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.findBy(username)
  .then((user) => {
    if(user && bcrypt.compareSync(password, user.password)){
      const token = generateToken(user);
        res.status(200).json({ message: "Welcome aboard!", user, token }).end();      
      }else{
        res.status(401).json({ message: "Invalid credentials" }).end()
    }})
    .catch(err => {
      res.status(500).json({ message: err.message }
      )
    })
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1d",
  };

  const secrets = {
    jwtSecret:
      process.env.JWT_SECRET ||
      "There is only one way two men can keep a secret",
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
