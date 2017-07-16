$(document).ready(function () {
  $('#escalation').dataTable( {
      "aaSorting": [[ 4, "asc" ]]
  });

  socket.emit('update stream info');
});

var socket = io.connect('http://localhost:3000');

socket.on('update command table', function(data) {
  console.log(data);
  var newRow = $('<tr>');
  var cols = "";
  cols += '<td>' + data.command.name + '</td>';
  cols += '<td class="hidden-phone">' + data.command.value + '</td>';
  cols += '<td><button class="btn btn-primary btn-xs" data-original-title="" title=""><i class="fa fa-pencil" data-original-title="" title=""></i></button><button class="btn btn-danger btn-xs" data-original-title="" title=""><i class="fa fa-trash-o " data-original-title="" title=""></i></button></td>';
  newRow.append(cols);

  $('#commands').append(newRow);
});

socket.on('stream info change', function(data) {
  // change values with data
  if(data) {
    document.getElementById("streamStatus").innerHTML = "Online";
    document.getElementById("streamViewers").innerHTML = "" + data.info.status +"";
  }
  else {
    $('#streamStatus').text = "Offline";
  }
});


setInterval(function(){
  socket.emit('update stream info');
}, 300000)

$('.add-command').submit(function(){
  console.log("Adding command");
  // Send the message to the server
  socket.emit("add command", {
   "name": $(this).find("#name").val(),
   "value": $(this).find("#text").val()
  });
  // Empty the form
  $(this).find("#name, #text").val('');
 return false;
});
