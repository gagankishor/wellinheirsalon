/**
 * Creates the super admin user (email + password login).
 * Run from project root:
 *   npm run create-super-admin
 * Or with custom email/password:
 *   SUPER_ADMIN_EMAIL=admin@wellins.com SUPER_ADMIN_PASSWORD=yourpassword node --env-file=.env.local scripts/create-super-admin.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/wellins-salon";
const EMAIL = process.env.SUPER_ADMIN_EMAIL || "aaryansen@wellins.local";
const PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "admin123";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["super_admin", "staff"], required: true },
    staffId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const User = mongoose.models?.User || mongoose.model("User", UserSchema);

async function main() {
  if (!MONGODB_URI) {
    console.error("Set MONGODB_URI in .env.local or environment.");
    process.exit(1);
  }
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  const emailLower = EMAIL.toLowerCase();
  const existing = await User.findOne({ email: emailLower });
  if (existing) {
    console.log("Super admin already exists:", emailLower);
    console.log("To change password, delete the user in MongoDB and run this script again.");
    await mongoose.disconnect();
    process.exit(0);
    return;
  }
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  await User.create({
    email: emailLower,
    passwordHash,
    role: "super_admin",
  });
  console.log("Super admin created successfully.");
  console.log("  Email:", emailLower);
  console.log("  Password:", PASSWORD);
  console.log("Sign in at /login with email and password.");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
