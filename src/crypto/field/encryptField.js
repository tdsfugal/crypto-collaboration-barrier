export default function encryptField(field) {
  if (typeof field === 'string' || field instanceof String)
    return `ENCRYPTED - ${field}`;
  return field;
}
