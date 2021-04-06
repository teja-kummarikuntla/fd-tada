const DANGER_NOTIFICATION = 'danger';
const SUCCESS_NOTIFICATION = 'success';
const FIELDS_TO_VALIDATE = ['subject', 'description', 'discount', 'validity'];

function getFieldValues() {
    return {
      subject: document.getElementById('voucher-subject').value,
      description: document.getElementById('voucher-description').value,
      discount: Number(document.getElementById('voucher-discount').value),
      validity: document.getElementById('voucher-validity').value
    };
  }

function clearFields() {
  document.getElementById('voucher-subject').value = ""
  document.getElementById('voucher-description').value = ""
  document.getElementById('voucher-discount').value = ""
  document.getElementById('voucher-validity').value = ""
  document.getElementById('custom-voucher').value = ""

  var errorPrompts = document.getElementsByClassName('validation-message');
  for(var i=0; i< errorPrompts.length; i++){
    errorPrompts[i].innerText = "";
  }
}

function validateFields() {
    document.querySelectorAll('.validation-message').innerHTML = '';
    var voucherData = getFieldValues();
    var isValid = true;
  
    for (var field of FIELDS_TO_VALIDATE) {
      if (!voucherData[field]) {
        document.getElementById(`${field}-error`).innerHTML = 'Please fill this required field';
        isValid = false;
      }
       else {
        document.getElementById(`${field}-error`).innerText = ""
      }
    }
    return isValid;
}

function saveVoucherToDb(subject, description, discount, validity, voucher) {
  let createObject = new Object();
  let id = generateUuid();
  createObject[`voucher_${id}`] = {subject, description, discount, validity, voucher};
  client.db.update("vouchers", "set", createObject), function(error) {
    console.log(error);
  }
}

function addListeners(){
    var voucherCode = ""
    document.getElementById("vocher-toggle").addEventListener('fwChange', function(){
        displayValue = document.getElementById("custom-voucher").style.display
        if (displayValue == 'block'){
        document.getElementById("custom-voucher").style.display = "none"
        } else {
            document.getElementById("custom-voucher").style.display = "block"
        }
    })

    document.getElementById('create-voucher').addEventListener('click', function(){
      if(validateFields()){
        var vSubject = document.getElementById('voucher-subject').value
        var vDescription = document.getElementById('voucher-description').value
        var vDiscount = Number(document.getElementById('voucher-discount').value)
        var vValidity = document.getElementById('voucher-validity').value
        var vCustomVoucher = document.getElementById('custom-voucher').value
        if(vCustomVoucher != ""){
          voucherCode = vCustomVoucher
          document.getElementById('voucher-label').innerText = voucherCode
          saveVoucherToDb(vSubject, vDescription, vDiscount, vValidity, voucherCode);
          client.db.get("vouchers").then(function (dbData) {
            console.log(dbData)
          }) 
        } else {
        client.request.invoke('generateVoucher', {}).then(
            function(data) {
              voucherCode = data.response[0]
              document.getElementById('voucher-label').innerText = voucherCode
              saveVoucherToDb(vSubject, vDescription, vDiscount, vValidity, voucherCode);
              client.db.get("vouchers").then(function (dbData) {
                console.log(dbData)
              })
            },
            function(err) {
              console.log("Request ID: " + err.requestID);
              console.log("error status: " + err.status);
              console.log("error message: " + err.message);
            });
          }

            document.getElementById('voucher-component').classList.remove('hidden')
            clearFields();
          }
    })

    document.getElementById('copy-button').addEventListener('click', function() {
      copyToClipboard(voucherCode)
      sendNotification(SUCCESS_NOTIFICATION, 'Copied to Clipboard');
      client.instance.close();
    })

    document.getElementById('paste-editor').addEventListener('click', function() {
      client.interface.trigger(
        "setValue", {id: "editor", text: "Text to be inserted"})
        .then(function(data) {
        // data - success message
        }).catch(function(error) {
        // error - error object
        });
    })
}

document.addEventListener('DOMContentLoaded', function() {
    addListeners();

    app.initialized().then(function(_client) {
        window.client = _client;
    })
});