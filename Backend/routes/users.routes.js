const express = require("express");
const {
  CheckVerify,
  updateUserDetails,
  updatePassword,
  getAllVerifiedUsers,
  logout,
} = require("../controllers/user.contoroller");

const router = express.Router();


router.post("/check", CheckVerify);
router.patch("/register", updateUserDetails);
router.patch("/pwd", updatePassword);
router.get("/all/users", getAllVerifiedUsers);
router.patch("/logout", logout);

module.exports = {
  routes: router,
};
