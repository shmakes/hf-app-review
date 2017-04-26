function(context) {

  // Check the form validity.
  var form = $(this);
  var isValid = form.data("validator").checkValidity();

  if (isValid) {
    var app = $$(form).app, 
      f = form.serializeObject();

    function saveDoc(doc) {
      var user = $("#user_name").text();
      var timestamp = ISODateString(new Date());
      var hasChanged = false;

      doc.type = f.type;

      if (doc["First-Name"] != f.first_name) {
        doc["First-Name"] = f.first_name;
        hasChanged = true;
      }
      if (doc["Last-Name"] != f.last_name) {
        doc["Last-Name"] = f.last_name;
        hasChanged = true;
      }
      if (doc["Middle-Name"] != f.middle_name) {
        doc["Middle-Name"] = f.middle_name;
        hasChanged = true;
      }
      if (doc["Nickname"] != f.nick_name) {
        doc["Nickname"] = f.nick_name;
        hasChanged = true;
      }

      if (doc.Street != f.street) {
        doc.Street = f.street;
        hasChanged = true;
      }
      if (doc.City != f.city) {
        doc.City = f.city;
        hasChanged = true;
      }
      if (doc.County != f.county) {
        doc.County = f.county;
        hasChanged = true;
      }
      if (doc.State != f.state.toUpperCase()) {
        doc.State = f.state.toUpperCase();
        hasChanged = true;
      }
      if (doc.Zip != f.zip) {
        doc.Zip = f.zip;
        hasChanged = true;
      }
      if (doc["Primary-Phone"] != f.phone_day) {
        doc["Primary-Phone"] = f.phone_day;
        hasChanged = true;
      }
      if (doc["Mobile-Phone"] != f.phone_mbl) {
        doc["Mobile-Phone"] = f.phone_mbl;
        hasChanged = true;
      }
      if (doc.from_email != f.email) {
        doc.from_email = f.email;
        hasChanged = true;
      }

      if (doc.app_date != f.app_date) {
//        doc.app_date = f.app_date; //**** Do we allow changes?
//        hasChanged = true;
      }


      if (doc["Veteran-Preference"] != f.veteran_pref_notes) {
        doc["Veteran-Preference"] = f.veteran_pref_notes;
        hasChanged = true;
      }

      var bdateStr = f.birth_year.replace(/^\s*|\s*$/g, '') + "-" + f.birth_month.replace(/^\s*|\s*$/g, '') + "-" + f.birth_day.replace(/^\s*|\s*$/g, '');
      if (bdateStr.length === 2) {
        doc.birth_date = "";
        hasChanged = true;
      } else {
        var birthYear = parseInt(f.birth_year, 10);
        var birthMonth = parseInt(f.birth_month, 10) - 1;
        var birthDay = parseInt(f.birth_day, 10);
        var bdate = new Date(birthYear, birthMonth, birthDay);
        var bdateNewStr = ISODateString(bdate).substr(0,10);
        if ((bdate.getFullYear() === birthYear) 
            && (bdate.getMonth() === birthMonth) 
            && (bdate.getDate() === birthDay)) { // was valid
          if (doc.birth_date != bdateNewStr) {   // was changed
            doc.birth_date = bdateNewStr;
            hasChanged = true;
          }
        }
      }
      if (doc.gender != f.gender) {
        doc.gender = f.gender;
        hasChanged = true;
      }


      if (doc["Emergency-Contact-Name"] != f.ec_name) {
        doc["Emergency-Contact-Name"] = f.ec_name;
        hasChanged = true;
      }
      if (doc["Emergency-Contact-Phone"] != f.ec_phone) {
        doc["Emergency-Contact-Phone"] = f.ec_phone;
        hasChanged = true;
      }
      if (doc["Emergency-Contact-Email"] != f.ec_email) {
        doc["Emergency-Contact-Email"] = f.ec_email;
        hasChanged = true;
      }


      if (doc.app_status != f.app_status) {
        doc.app_status = f.app_status;
        hasChanged = true;
      }

      if (doc.app_status_note != f.app_status_note) {
        doc.app_status_note = f.app_status_note;
        hasChanged = true;
      }

      if (!doc.metadata) {
        doc.metadata = {};
        doc.metadata.created_at = f.created_at;
        doc.metadata.created_by = f.created_by;
      }
      doc.metadata.updated_at = timestamp;
      doc.metadata.updated_by = user;


      if (hasChanged) {
        // Set indicator for saved to logistics database.
        $("#SavedToWaitlist").html("");
        if (f.app_status === "Accepted") {
          acceptGrdApp(app, f, saveGrdApplication, doc);
        } else {
          saveGrdApplication(app, doc);
        }

      } else {
        alert("No information changed since last save.");
        return false;
      }
    };

    if (f._rev) {
      app.db.openDoc(f._id, {
        success : function(doc) {
          doc._rev = f._rev;
          saveDoc(doc);
        }
      }); 
    }
    return false;
  }
  return true;
};

function saveGrdApplication(app, doc) {
  app.db.saveDoc(doc, {
    success : function(resp) {
      $("input[name='_id']").val(resp.id);
      $("input[name='_rev']").val(resp.rev);
      // Pop-up the save confirmation.
      $("#saved_trigger").click();
      $("#continue_edit").focus();            
    }
  });
}

//@ sourceURL=/grdedit/submit.js
