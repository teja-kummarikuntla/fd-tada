const DANGER_NOTIFICATION = 'danger';
const SUCCESS_NOTIFICATION = 'success';

document.onreadystatechange = function () {
  addListeners();
  
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on('app.activated', onAppActivate);
    }
  }
};

function openCreateVocherModal(title, modalData) {
  client.interface.trigger('showModal', {
    title: title,
    template: 'create_vocher.html',
    data: modalData || {}
  });
}

function openListVouchersModal() {
  client.interface.trigger('showModal', {
    title: 'List of vouchers created',
    template: 'list_vouchers.html'
  });
}
function addListeners() {
  document.getElementById('create-voucher').addEventListener('click', function() {
    openCreateVocherModal('Create Vocuher', {
      newVocher: true
    });
  });

  document.getElementById('list-vouchers').addEventListener('click', function() {
    // openListVouchersModal();
    dispVouchers();
  });
}

// document.addEventListener('DOMContentLoaded', function() {
//   addListeners();
// })

function dispVouchers() {
  client.db.get("vouchers").then(function (dbData) {
    let keysArr = Object.keys(dbData).reverse();
    keysArr = keysArr.slice(0, 5);
    let vou = [];
    keysArr.forEach((element) => {
      vou.push(`<div class="lookup">
      <label class="tada-app-label text--xsmall lookup-body"><b> Voucher Subject </b></label>
      <p class="lookup-body">${dbData[element].subject}</p>
      <label class="tada-app-label text--xsmall lookup-body"><b>Voucher Descriptioon </b></label>
      <p class="lookup-body">${dbData[element].description}</p>
      <label class="tada-app-label text--xsmall lookup-body"><b> Discount(%) </b></label>
      <p class="lookup-body">${dbData[element].discount}</p>
      <label class="tada-app-label text--xsmall lookup-body"><b>Validity</b></label>
      <p class="lookup-body">${dbData[element].validity}</p>
      <label class="tada-app-label text--xsmall lookup-body"><b> Vouchere Code </b></label>
      <fw-label class="lookup-body" value="${dbData[element].voucher}" onClick= "pasteInEditor(\'${dbData[element].voucher}'\)" name="pasteInEditor" data-arg1="${dbData[element].voucher}" color="green"></fw-label>
      <fw-icon name="magic-wand" size="12" color="green" onClick= "pasteInEditor(\'${dbData[element].voucher}'\)">
      </fw-icon>
      </div>`);
    });
    document.querySelector("#values").innerHTML = vou.join(
      " "
    );
  }),
    function (error) {
      console.error(error);
    };
}

function pasteInEditor(value){
  client.interface.trigger(
    "setValue", {id: "editor", text: value})
    .then(function(data) {
      showNotify(SUCCESS_NOTIFICATION, "Success:", "Pasted in Editor")
    }).catch(function(error) {
      console.log("Error: ", error)
    });
}

function onAppActivate() {
  var textElement = document.getElementById('apptext');
  var getContact = client.data.get('contact');
  getContact.then(showContact).catch(handleErr);

  function showContact(payload) {
    textElement.innerHTML = `Ticket created by ${payload.contact.name}`;
  }
}

function handleErr(err) {
  console.error(`Error occured. Details:`, err);
}

window.frsh_init().then(function(client) {
  window.client = client;
  // Instance APIs
  // resize the instance

  // current instance details
  client.instance.context().then(function(context){

    // receive message from other instances
    client.instance.receive(function(e){
      let data = e.helper.getData();
      console.log(`${context.instance_id}: Received messsage from ${JSON.stringify(data.sender)}: Message: `, data.message);

      pasteInEditor(data.message.code)

    });

    console.log('instance API context', context);
  });
});