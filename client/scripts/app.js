// YOUR CODE HERE:
var App = {};
App.chatRooms = {};

App.parseResponse = function(response) {
  var results = response.results;
  var text = [];
  for (var i = 0; i < results.length; i++) {
    if (results[i] && results[i].username && results[i].text) {
      text[i] = {};
      text[i].username = App.convert(results[i].username);
      text[i].text = App.convert(results[i].text);
      text[i].timeStamp = $.timeago(results[i].createdAt);
      text[i].room = App.convert(results[i].roomname);
      App.chatrooms[text[i].room] = true;
    }
  }
  return text;
};

App.convert = function(string) {
  string = string || "";
  var letters = string.split("");
  for (var i = 0; i < letters.length; i++) {
    if (letters[i] === "<") {
      letters[i] = "&#60;"
    }
  }
  return letters.join("");
};


App.display = function(array) {
  $('#main ul').empty();
  for (var i = 0; i < array.length; i++) {
    if (array[i]) {
      $('#main ul').append('<div class="chat"><h4 class="username">'+array[i].username+ '</h4><time>'+ array[i].timeStamp +  '</time><p>' +
        array[i].text + '</p></div>');
    }
  }
};

App.print = function(array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i]) {
      console.log(array[i].username+ ': ' + array[i].text);
    }
  }
};

App.fetch = function(callback) {
  $.ajax({
    url: "https://api.parse.com/1/classes/chatterbox?order=-createdAt",
    dataType: "JSON",
    success: function(response) {
      callback(App.parseResponse(response));
    }
  });
};

App.send = function(messageObject) {
  $.ajax({
    url: "https://api.parse.com/1/classes/chatterbox",
    dataType: "JSON",
    data: JSON.stringify(messageObject),
    type: "POST",
    contentType: "application/json",
    success: function() {
      console.log("Message sent successfully");
    },
    error: function() {
      console.log("Message not sent successfully");
    }
  });
};

App.submitListener = function() {
  $('form input').focus();
  $('form').on("submit", function(e){return false;})
  $('form').on("submit", function() {
    var message = {};
    message.text = $('input:text').val();
    message.username = window.location.href.split("username=")[1];
    message.roomname = "lobby";
    console.log(message.text);
    App.send(message);
    $('input:text').val('');
  });
};



$(document).ready(function() {
  App.submitListener();
  App.fetch(App.display);
  var interval = setInterval(function() {App.fetch(App.display)}, 3000);
});



