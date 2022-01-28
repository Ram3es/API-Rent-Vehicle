import bcrypt from "bcrypt"
export const generateSalt = async (round: number) => await bcrypt.genSalt(round)