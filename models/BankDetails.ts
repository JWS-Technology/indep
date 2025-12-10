import mongoose from "mongoose";

const BankDetailsSchema = new mongoose.Schema({
  teamName: String,
  teamId: String,
  managerName: String,
  accountNumber: String,
  bankName: String,
  ifscCode: String,
});

const BankDetails =
  mongoose.models.BankDetails ||
  mongoose.model("BankDetails", BankDetailsSchema);

export default BankDetails;
