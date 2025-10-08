const bcrypt = require('bcrypt');


const encript = (plainPassword)=>{
    bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
  if (err) throw err;
 return hashedPassword;

});
}
module.exports = encript;