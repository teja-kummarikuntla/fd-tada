const voucherCodeGenerator = require('voucher-code-generator');

exports = {

  generateVoucher: function(args){
    let voucher = voucherCodeGenerator.generate({
      length: 8,
      count: 1
  });
  renderData(null, voucher);
  }
  
};
/**
 * UI -> Button
 * Usecase - clicked -> smi -(invoke a function in server.js) -> randomecode -(renderData();)-> UI -> button -(client.interface.something) -> editor
 */