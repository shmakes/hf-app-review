function() {

  $("#app_date").dateinput({
    format: 'yyyy-mm-dd',
    selectors: true,
    min: -3000,
    max: 1,
    speed: 100
  });

  $.tools.validator.fn("[name=birth_day]", "A valid date from 1910 - 2000.  YYYY-MM-DD", function(input, value) { 
    var bYear = $("input[name='birth_year']").val().replace(/^\s*|\s*$/g, '');
    var bMonth = $("input[name='birth_month']").val().replace(/^\s*|\s*$/g, '');
    var bDay = value.replace(/^\s*|\s*$/g, '');

    var bdateStr = bYear + "-" + bMonth + "-" + bDay;
    if (bdateStr.length === 2) return true;  // Empty fields.

    var birthYear = parseInt(bYear, 10);
    var birthMonth = parseInt(bMonth, 10) - 1;
    var birthDay = parseInt(bDay, 10);
    var bdate = new Date(birthYear, birthMonth, birthDay);
    var byr = bdate.getFullYear();
    var bdateNewStr = ISODateString(bdate).substr(0,10);
    if ((bdate.getFullYear() === birthYear) 
        && (bdate.getMonth() === birthMonth) 
        && (bdate.getDate() === birthDay)) { // was valid
      if ((byr >= 1910) && (byr <= 2000)) {  // in range
        return true;
      }
    }
    return false;
  });

  $("#app_qualified_date").dateinput({
    format: 'yyyy-mm-dd',
    selectors: true,
    min: -300,
    max: 1,
    speed: 100
  });


  $("#form-Vet").validator({ position: 'bottom center' });

  document.title = $("input[name='first_name']").val() + " " + $("input[name='last_name']").val();

  $("#saved_trigger").overlay({
    mask: {
      color: '#ebecff',
      loadSpeed: 200,
      opacity: 0.7
    },

    closeOnClick: false,
    top: '1'
  });

  $("input[name=middle_name]").keydown(function(event) {
    if (event.which == 190) {
       event.preventDefault();
     }
  });

  $(this).show();
};

//@ sourceURL=/vetedit/after.js
