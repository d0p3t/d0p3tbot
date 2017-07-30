$(document).ready(function () {
  $('#escalation').dataTable( {
    bFilter: false,
    bLengthChange: false,
    "aaSorting": [[ 0, "asc" ]]
  });

  $('#escalation2').dataTable( {
    bFilter: false,
    bLengthChange: false,
    bSort: false,
    bInfo: false,
    bPaginate: false
  });

  $('#escalation3').dataTable( {
    bFilter: false,
    bLengthChange: false,
    bSort: false,
    bInfo: false,
    bPaginate: false
  });

  socket.emit('update stream info');
});

var socket = io.connect('http://localhost:3000');

socket.on('update command table', function(data) {
  var newRow = $('<tr name="' + data.command.name +'">');
  var cols = "";
  cols += '<td>' + data.command.name + '</td>';
  cols += '<td class="hidden-phone">' + data.command.value + '</td>';
  cols += '<td><button class="btn btn-danger btn-xs" data-original-title="" title=""><i class="fa fa-trash-o " data-original-title="" title=""></i></button></td>';
  newRow.append(cols);

  $('#commands').append(newRow);
});

socket.on('update notice table', function(data) {
  var newRow = $('<tr name="' + data.notice.name +'">');
  var cols = "";
  cols += '<td>' + data.notice.name + '</td>';
  cols += '<td class="hidden-phone">' + data.notice.value + '</td>';
  cols += '<td><button class="btn btn-danger btn-xs" data-original-title="" title=""><i class="fa fa-trash-o " data-original-title="" title=""></i></button></td>';
  newRow.append(cols);

  $('#notices').append(newRow);
});

socket.on('update edit command table', function(data) {
  var x = document.getElementsByName(''+ data.command.name + '')[0];
  x.getElementsByTagName("td")[1].innerHTML = "" + data.command.value + "";
});

socket.on('update del command table', function(data) {
  var x = document.getElementsByName(''+ data.command.name + '')[0].remove();
});

socket.on('update edit notice table', function(data) {
  var x = document.getElementsByName(''+ data.notice.name + '')[0];
  x.getElementsByTagName("td")[1].innerHTML = "" + data.notice.value + "";
});

socket.on('update del notice table', function(data) {
  var x = document.getElementsByName(''+ data.notice.name + '')[0].remove();
});

socket.on('update edit alert table', function(data) {
  var x = document.getElementsByName(''+ data.alert.name + '')[0];
  x.getElementsByTagName("td")[1].innerHTML = "" + data.alert.value + "";
});

socket.on('stream info change', function(data) {
  if(data.info.stream == null) {
    document.getElementById("streamStatus").innerHTML = "Offline";
    document.getElementById("streamViewers").innerHTML = "0";
  }
  else {
    document.getElementById("streamPhoto").src = "" + data.info.stream.channel.logo + "";
    document.getElementById("streamPhotoRight").src = "" + data.info.stream.channel.logo + "";
    document.getElementById("streamPhotoRightInner").src = "" + data.info.stream.channel.logo + "";
    document.getElementById("streamStatus").innerHTML = "Online";
    document.getElementById("streamViewers").innerHTML = "" + data.info.stream.viewers +"";
  }
});


setInterval(function(){
  socket.emit('update stream info');
}, 60000)

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

$('.edit-command').submit(function(){
  console.log("Editing command");
  // Send the message to the server
  socket.emit("edit command", {
   "name": $(this).find("#editname").val(),
   "value": $(this).find("#edittext").val()
  });
  // Empty the form
  $(this).find("#edittext").val('');
  return false;
});

$('.del-command').submit(function(){
  console.log("Deleting command");

  socket.emit("del command", {
    "name": $(this).find("#delname").val()
  });

  $(this).find("#delname").val('');
  return false;
});

$('.add-notice').submit(function(){
  console.log("Adding notice");
  // Send the message to the server
  socket.emit("add notice", {
   "name": $(this).find("#name").val(),
   "value": $(this).find("#text").val()
  });
  // Empty the form
  $(this).find("#name, #text").val('');
  return false;
});

$('.edit-notice').submit(function(){
  console.log("Editing notice");
  // Send the message to the server
  socket.emit("edit notice", {
   "name": $(this).find("#editname").val(),
   "value": $(this).find("#edittext").val()
  });
  // Empty the form
  $(this).find("#edittext").val('');
  return false;
});

$('.del-notice').submit(function(){
  console.log("Deleting notice");

  socket.emit("del notice", {
    "name": $(this).find("#delname").val()
  });

  $(this).find("#delname").val('');
  return false;
});

$('.edit-alert').submit(function(){
  console.log("Editing alert");
  // Send the message to the server
  socket.emit("edit alert", {
   "name": $(this).find("#editname_a").val(),
   "value": $(this).find("#edittext_a").val()
  });
  // Empty the form
  $(this).find("#edittext_a").val('');
  return false;
});

$('.edit-notice-settings').submit(function(){
  console.log("Editing notice settings");
  // Send the message to the server
  socket.emit("edit notices settings", {
   "name": $(this).find("#editname_v").val(),
   "value": $(this).find("#editvalue_v").val()
  });
  return false;
});
