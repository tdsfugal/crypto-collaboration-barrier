const crypto = {};

const setupCCB = options => {
  console.log(options);
  crypto.encrypt = options.encrypt ? options.encrypt : null;
  crypto.decrypt = options.decrypt ? options.decrypt : null;
};

export default setupCCB;
