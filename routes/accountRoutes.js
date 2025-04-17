const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const {
  getAccounts,
  updateAccountStatus,
} = require("../controllers/accountController");

router.get("/", authenticate, getAccounts);
router.post("/:id/status", authenticate, updateAccountStatus);

module.exports = router;
