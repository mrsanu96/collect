const router = require("express").Router();
const crypto = require("crypto");

const {
  registrationValidate,
} = require("../helpers/validation_schema");
const User = require("../model/users");

//Signup
router.post("/", async (req, res) => {
  try {
    const { error } = registrationValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking exit username
    let user = await User.findOne({ name: req.body.name });
    if (user) return res.status(400).send("User name already exists");

    //checking exit email
    let email = await User.findOne({ email: req.body.email });
    if (email) return res.status(400).send("Email already exists");

    //Hashing PWs
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({ ...req.body, password: hashPassword }).save();
    let uId = user._id.toString();

    let data = {
      userId: uId,
      token: crypto.randomBytes(32).toString("hex"),
    };

    const token = await new Token(data).save();
    const url = `${process.env.BASE_URL}api/regi/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);

    return res.status(201).send({ message: "An Email sent to your email" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

//email verification


//login
// router.post("/login", async (req, res) => {
//   const { error } = loginValidate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   //checking exit
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) return res.status(400).send("Email or Password is incorrect");

//   //Password
//   const validPassword = await bcrypt.compare(req.body.password, user.password);
//   if (!validPassword) return res.status(400).send("Incorrect Password");

//   if (!user.verified) {
//     let token = await Token.findOne({ userId: user._id });
//     if (!token) {
//       const token = await new Token({
//         userId: user._id,
//         token: crypto.randomBytes(32).toString("hex"),
//       }).save();
//       const url = `${process.env.BASE_URL}api/regi/${user._id}/verify/${token.token}`;
//       await sendEmail(user.email, "Verify Email", url);
//     }
//     return res.status(400).send({ message: "An Email sent to your email" });
//   }

//   const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  

//   res.send("Logged in Successfully");
// });

//update
// router.post("/update", verify, async (req, res) => {
  
// });

module.exports = router;
