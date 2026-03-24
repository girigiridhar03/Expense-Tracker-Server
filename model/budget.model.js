import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
budgetSchema.index(
  { userId: 1, categoryId: 1, month: 1, year: 1 },
  { unique: true },
);
const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
