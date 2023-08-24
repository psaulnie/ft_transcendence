import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function comparePassword(data: string, hash: string) {
  try {
    return await bcrypt.compare(data, hash);
  } catch (err) {
    console.error(err);
  }
}
