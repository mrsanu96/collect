const express = require("express");
const router = express.Router();

const User = require("../model/users");


const registerRouter = router.post('/register', async (req, res) => {
  
  
 
        try {
                const user = new User({
                username: req.body.username,
                email: req.body.email,
                description: req.body.description,
                website: req.body.website,
                facebook: req.body.facebook,
                twitter: req.body.twitter,
                instagram: req.body.instagram

            })
            await user.save()
            return res.status(201).json(user)
        } catch (err) {
            return res.status(400).json({ message: err.message })
        }
    }
)

// router.post("/signup", (req, res) => {
//   let { username, email, description, website, facebook, twitter, instagram } =
//     req.body;



//   const newUser = new User({
//     username,
//     email,
//     description,
//     website,
//     facebook,
//     twitter,
//     instagram,
//   });

//   newUser
//     .save()
//     .then((result) => {
//       res.json({
//         status: "SUCCESS",
//         message: "Successfull",
//         data: result,
//       });
//     })
//     .catch((err) => {
//         console.log(err)
//       res.json({
//         status: "FAILED",
//         message: "Failed to Save",
//       });
//     });
// });

module.exports = registerRouter