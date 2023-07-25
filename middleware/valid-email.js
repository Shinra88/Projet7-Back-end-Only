const emailValidator = require("email-validator");

module.exports = (req, res, next) => {
  const emailToValidate = req.body.email;
  if (!emailValidator.validate(emailToValidate)) {
    return res.status(400).json({ error: "Adresse mail invalide !" });
  }
  next();
};