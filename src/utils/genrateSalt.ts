import * as bcrypt from "bcrypt";
export const generateSalt = async (round: number) => {
  return await bcrypt.genSalt(round);
};
