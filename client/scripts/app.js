// YOUR CODE HERE:
var App = {};
App.chatRooms = {};
App.user = {};
App.user.friends = {};


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

      if (!(text[i].room in App.chatRooms)) {
        App.chatRooms[text[i].room] = true;
        $(".rooms").append("<option>" + text[i].room + "</option>");
      }
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

// App.updateRooms = function() {
//   $(".rooms").empty();
//   for (var key in App.chatRooms) {
//     $(".rooms").append("<option>" + key + "</option>");
//   }
// };

App.display = function(array) {
  $('#main ul').empty();
  for (var i = 0; i < array.length; i++) {
    if (array[i] && array[i].room === App.user.room) {
      if (App.user.friends[array[i].username]) {
        $('#main ul').append('<div class="chat"><span class="username">'+array[i].username+ '</span><time>'+ array[i].timeStamp +  '</time><p><strong>' +
          array[i].text + '</p></strong></div>');
      } else {
        $('#main ul').append('<div class="chat"><span class="username">'+array[i].username+ '</span><time>'+ array[i].timeStamp +  '</time><p>' +
          array[i].text + '</p></div>');
      }
    }
  }
  App.addFriend();
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
    message.username = App.user.username;
    message.roomname = App.user.room;
    console.log(message.text);
    App.send(message);
    $('input:text').val('');
  });
};

App.switchRoomListener = function() {
  $(".rooms").on("change", function() {
    App.user.room = $(".rooms option:selected").text();
    App.fetch(App.display);
  });
};

App.addFriend = function() {
  $(".username").click(function(e) {
    App.user.friends[e.target.innerHTML] = true;
  });
};


$(document).ready(function() {
  App.user.username = window.location.href.split("username=")[1];
  App.user.room = "lobby";
  $(".rooms option:selected").text("");

  App.submitListener();
  App.switchRoomListener();
  App.fetch(App.display);
  var interval = setInterval(function() {
    App.fetch(App.display);
  }, 500);
});



