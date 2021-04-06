/* Display notifications via Interface API */
function showNotify(type, title, message) {
  client.interface.trigger("showNotify", {
    type: type,
    title: title,
    message: message,
  }),
    function (error) {
      console.log("Error from showNotify:", title, error);
    };
}
  
  function generateUuid() {
    return Math.floor(Math.random() * 1000000000);
  }

  function copyToClipboard(text) {
    var input = document.body.appendChild(document.createElement("input"));
    input.value = text;
    input.focus();
    input.select();
    document.execCommand('copy');
    input.parentNode.removeChild(input);
}