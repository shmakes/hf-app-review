function() {
  var app = $$(this).app;

  $("#app_date").dateinput({
    format: 'yyyy-mm-dd',
    selectors: true,
    min: -3000,
    max: 1,
    speed: 100
  });


  $.tools.validator.fn("[name=birth_day]", "A valid date from 1930 - 2010.  YYYY-MM-DD", function(input, value) { 
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
      if ((byr >= 1930) && (byr <= 2010)) {  // in range
        return true;
      }
    }
    return false;
  });

  $("#form-Grd").validator({ position: 'bottom center' });

  document.title = $("input[name='first_name']").val() + " " + $("input[name='last_name']").val();

  // Handle shirt size selection.
  var storedShirtSize = $("#raw_shirt_size").attr('value').toUpperCase();
  $("#shirt_size").val(storedShirtSize);

  var validShirtSizes = [ "None", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL" ];
  $("#shirt_size").validator({inputEvent: "blur"});
  var shirtSizeErr = "Please make a selection.";
  if ($("#raw_shirt_size").attr('value').length > 0) {
    $("#shirt_size")
    shirtSizeErr += " (stored value: " + $("#raw_shirt_size").attr('value') + ")";
  }
  $.tools.validator.fn("#shirt_size", shirtSizeErr,
    function(input, value) {
    return (jQuery.inArray(value, validShirtSizes) >= 0);
  });

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
  $("#existing_trigger").overlay({
    mask: {
      color: '#ebecff',
      loadSpeed: 200,
      opacity: 0.7
    },

    closeOnClick: false,
    top: '1',
    fixed: false
  });

  var appStatus = $("#app_status").val();
  var checkName = $("input[name=last_name]").val().replace(/[^a-zA-Z]/g, '');
  $("#DupeCheckName").html("Possible Duplicates for: " 
    + $("input[name=first_name]").val() + " " + $("input[name=last_name]").val()  
    + " on " + $("input[name=street]").val() 
    + " in " + $("input[name=city]").val());
  var startKey = [];
  startKey.push(checkName);
  var endKey = [];
  endKey.push(checkName + "0");

  if (appStatus === "New" && checkName && checkName.length > 1) {
    var logisticsDb = getLogisticsDb(app);
    logisticsDb.openDoc("_design/basic", {
      success : function(ddoc) {
        var logisticsApp = jQuery.extend({}, app);
        logisticsApp.db = logisticsDb;
        logisticsApp.ddoc = ddoc;
        logisticsApp.db.view("basic/all_by_name", {
          limit : 250,
          startkey : startKey,
          endkey : endKey,
          descending : false,
          type : "newRows",
          success: function(resp) {
            if (resp.rows.length > 0) {
              var rslt = $("#dups");
              rslt.html("");
              for (row in resp.rows) {
                anchor = "<a href='#'>";
                id = resp.rows[row].id;
                person = resp.rows[row].value;
                //if (person.status === "Flown") {
                //  continue;
                //}
                if (person.type == 'Veteran') {
                  anchor = "<a href='" + logisticsDb.uri + "_design/basic/vet_edit.html?vetid=" + id + "' target='_blank'>";
                } else if (person.type == 'Guardian') {
                  anchor = "<a href='" + logisticsDb.uri + "_design/basic/grd_edit.html?grdid=" + id + "' target='_blank'>";
                }
                tr = $("<tr/>", { class: person.type });
                tr.append("<td>" + anchor + person.name + "</a></td>");
                tr.append("<td>" + anchor + person.city + "</a></td>");
                tr.append("<td>" + anchor + person.appdate + "</a></td>");
                tr.append("<td>" + anchor + person.flight + "</a></td>");
                tr.append("<td>" + anchor + person.status + "</a></td>");
                tr.append("<td>" + anchor + person.pairing + "</a></td>");
                rslt.append(tr);
              }
              if (resp.rows.length > 249) {
                //tr = $("<tr/>", { class: person.type });
                tr = $("<tr/>");
                tr.append("<td colspan='6'><strong>*** More matches may exist. Check the database manually. ***</strong></td>");
                rslt.append(tr);
              }
              $("#existing_trigger").click();
            }
          }
        })
      }
    });

  }

  $(this).show();
};

//@ sourceURL=/grdedit/after.js
