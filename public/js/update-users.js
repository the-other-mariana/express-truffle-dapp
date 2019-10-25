$(document).ready(function() {

  function loadInfo(){
    $.ajax({
      async: true,
      url: 'users/',
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        console.log(data);
        $('#usersRow').empty();
        var usersRow = $('#usersRow');
        // maaaster
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
  }

  //loadInfo();
    $("#users-button").click((e) => {
      e.preventDefault();
      loadInfo();
    });

/*
var async_request=[];
var responses=[];

function loadInfo(){
  $.ajax({
    async: true,
    url: 'users/',
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      console.log(data);
      responses.push(data);

    }
  });
}
var users = 3;
  for (var i = 0; i < users; i++){
    async_request.push(loadInfo());

  }


  $.when.apply(null, async_request).done( function(){
    // all done
    console.log('all request completed')
    console.log(responses);
});*/
});
