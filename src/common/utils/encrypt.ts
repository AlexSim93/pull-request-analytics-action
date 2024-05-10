import crypto from "crypto";

export const encrypt = (str: string) =>
  crypto.createHash("sha256").update(str).digest("hex");
