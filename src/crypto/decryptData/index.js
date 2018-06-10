import { decryptField } from '../field';

export default function decryptData(data, map) {
  if (map) {
    if (!data) return null;

    if (typeof data === 'string' || data instanceof String) {
      return decryptField(data);
    }

    const decrypted = Object.keys(data).reduce((acc, key) => {
      if (data[key] && map[key]) acc[key] = decryptData(data[key], map[key]);
      return acc;
    }, {});
    return Object.assign({}, data, decrypted); // overwrite with decrypted results
  }
  return data;
}
