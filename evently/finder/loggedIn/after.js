function() {
  $('#status').change(function() {
    $('#last_name').trigger('keyup');
  });
  $('#status').val('New');
  $(this).show();
};

//@ sourceURL=/finder/loggedIn/after.js
