function() {
  $('#status').change(function() {
    $('#refreshData').trigger('click');
  });
  $('#return_count').change(function() {
    $('#refreshData').trigger('click');
  });
  $('#refreshData').trigger('click');
  $(this).show();
};

//@ sourceURL=/finder/loggedIn/after.js
