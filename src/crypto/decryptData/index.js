import { decryptField } from '../field';

export default function decryptData(data, map) {
  if (map) {
    if (typeof data === 'object') {
      const decrypted = Object.keys(data).reduce((acc, key) => {
        console.log(key);
        console.log(map[key]);
        console.log(data[key]);
        if (data[key] && map[key]) acc[key] = decryptField(data[key], map[key]);
        return acc;
      }, {});
      return Object.assign({}, data, decrypted); // overwrite with decrypted results
    }
    return decryptField(data);
  }
  return data;
}
