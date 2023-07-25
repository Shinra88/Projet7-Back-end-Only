const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();
passwordSchema
  // Minimum 8 caractères
  .is()
  .min(8)
  // Maximum 25 caractères
  .is()
  .max(25)
  // Majuscule
  .has()
  .uppercase()
  // minuscules
  .has()
  .lowercase()
  // 2 chiffre
  .has()
  .digits()
  // Pas d'espaces
  .has()
  .not()
  .spaces();

module.exports = (req, res, next) => {
  const userPassword = req.body.password;
  if (!passwordSchema.validate(userPassword)) {
    return res.status(400).json({
      error: `Le mot de passe ne respecte pas ces règles 
      ${passwordSchema.validate(userPassword, { list: true })}`,
    });
  }
  next();
};