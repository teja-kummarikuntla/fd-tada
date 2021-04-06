function dispVouchers() {
    client.db.get("vouchers").then(function (dbData) {
      let keysArr = Object.keys(dbData).reverse();
      keysArr = keysArr.slice(0, 5);
      let conv = [];
      keysArr.forEach((element) => {
        conv.push(`<div class="lookup">
        <label>Voucher Subject</label>
        <p>${dbData[element].subject}</p>
        <label>Voucher Description </label>
        <p>${dbData[element].description}</p>
        <label>Discount Percentage</label>
        <p>${dbData[element].discount}</p>
        <label>Validity</label>
        <p>${dbData[element].validity}</p>
        <label>Voucher</label>
        <p>${dbData[element].voucher}</p>
      </div>`);
      });
      document.querySelector("#disp_conversions #values").innerHTML = conv.join(
        ""
      );
    }),
      function (error) {
        console.error(error);
      };
  }

  document.addEventListener('DOMContentLoaded', function() {
    addListeners();

    app.initialized().then(function(_client) {
        window.client = _client;
    })
});