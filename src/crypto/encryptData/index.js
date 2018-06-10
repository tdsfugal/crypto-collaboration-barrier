import { encryptField } from '../field';

export default function encryptData(data, map) {
  if (map) {
    if (!data) return null;

    if (typeof data === 'string' || data instanceof String) {
      return encryptField(data);
    }

    const decrypted = Object.keys(data).reduce((acc, key) => {
      if (data[key] && map[key]) acc[key] = encryptData(data[key], map[key]);
      return acc;
    }, {});
    return Object.assign({}, data, decrypted); // overwrite with decrypted results
  }
  return data;
}
