const Account = require("../models/Account");

const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json({ accounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAccountStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "Researching",
      "Pending",
      "Approved",
      "Declined",
      "Target",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      message: "Status updated successfully",
      accountId: account._id,
      newStatus: account.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAccounts, updateAccountStatus };
