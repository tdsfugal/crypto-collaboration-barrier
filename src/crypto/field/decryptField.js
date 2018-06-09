export default function decryptField(field) {
  console.log(`PROCESS: ${field}`);
  if (typeof field === 'string' || field instanceof String) {
    if (field.includes('ENCRYPTED:')) return field.replace('ENCRYPTED:', '');
  }
  return field;
}
