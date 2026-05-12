import bcrypt from "bcryptjs";

const run = async () => {
  const hash = await bcrypt.hash("abc123", 10);
  console.log(hash);
};

run();