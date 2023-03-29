const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

$("#money").text(formatter.format($("#money").text()));

var delayInMilliseconds = 3000; //3 second

setTimeout(function() {
  $("#success").hide()
  $("#error").hide()
  $("#warning").hide()
}, delayInMilliseconds);