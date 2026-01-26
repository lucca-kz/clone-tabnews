import bcryptjs from "bcryptjs";
import crypto from "crypto";

async function hash(password) {
  const pepper = process.env.PEPPER_SECRET;
  const hmac = crypto
    .createHmac("sha256", pepper)
    .update(password)
    .digest("hex");
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(hmac, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  const pepper = process.env.PEPPER_SECRET;
  const hmac = crypto
    .createHmac("sha256", pepper)
    .update(providedPassword)
    .digest("hex");
  return await bcryptjs.compare(hmac, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
