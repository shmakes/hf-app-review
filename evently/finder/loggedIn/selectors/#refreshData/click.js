function() {
  var sts = $("#status").val();
  var cnt = $("#return_count").val();

  var startKey = [];
  var endKey = [];
  var viewName = "hf-app-review/new_apps";

  startKey.push(sts);
  startKey.push("9");
  endKey.push(sts);
  endKey.push("0");

  // Clear the result area.
  var rslt = $("#results");
  rslt.html("");

  // Get the data.
  var app = $$(this).app;
  app.db.view(viewName, {
    limit : cnt,
    startkey : startKey,
    endkey : endKey,
    descending : true,
    type : "newRows",
    success: function(resp) {
      var id, person, anchor, tr;
      for (row in resp.rows) {
        anchor = "<a href='#'>";
        id = resp.rows[row].id;
        person = resp.rows[row].value;

        if (person.type == 'VeteranApp') {
          anchor = "<a href='vet_edit.html?vetid=" + id + "' target='_blank'>";
        } else if (person.type == 'GuardianApp') {
          anchor = "<a href='grd_edit.html?grdid=" + id + "' target='_blank'>";
        }

        tr = $("<tr/>", { class: person.type.slice(0, -3) });
        tr.append("<td>" + anchor + person.name + "</a></td>");
        tr.append("<td>" + anchor + person.city + "</a></td>");
        tr.append("<td>" + anchor + person.appdate.substring(0, 10) + "</a></td>");
        tr.append("<td>" + anchor + person.app_status + "</a></td>");
        tr.append("<td>" + anchor + person.pairing + "</a></td>");
        tr.append("<td>" + anchor + person.email + "</a></td>");
        tr.append("<td>" + anchor + person.ipaddr + "</a></td>");
        rslt.append(tr);  

      }
      $("table").tablesorter();
      $("table").trigger("update");
    }
  })

  return true;
};

//@ sourceURL=/finder/refreshData.js
