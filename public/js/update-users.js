$(document).ready(function() {

    $("#users-button").click(() => {
      $.ajax({
        url: 'users/',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
          console.log(data);
          $('#usersRow').empty();
          var usersRow = $('#usersRow');

          //$('#usersRow').html(data[0].username + ": " + data[0].password + " " + data[1].username + ": " + data[1].password);
          for(var i = 0; i < data.length; i++){
            var userTemplate = $('#userTemplate');
            userTemplate.find('.panel-title').text("User #" + i);
            userTemplate.find('.user-name').text(data[i].username);
            userTemplate.find('.user-password').text(data[i].password);

            usersRow.append(userTemplate.html());
          }
        }
      });
    });

});
