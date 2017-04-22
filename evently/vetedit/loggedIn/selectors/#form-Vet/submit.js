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


      if (doc["Guardian-Preference"] != f.guardian_pref_notes) {
        doc["Guardian-Preference"] = f.guardian_pref_notes;
        hasChanged = true;
      }
      if (doc["Preferred-Guardian-Phone-Number"] != f.guardian_pref_phone) {
        doc["Preferred-Guardian-Phone-Number"] = f.guardian_pref_phone;
        hasChanged = true;
      }
      if (doc["Preferred-Guardian-Email"] != f.guardian_pref_email) {
        doc["Preferred-Guardian-Email"] = f.guardian_pref_email;
        hasChanged = true;
      }

      var bdateStr = f.birth_month.replace(/^\s*|\s*$/g, '') + "/" + f.birth_day.replace(/^\s*|\s*$/g, '') + "/" + f.birth_year.replace(/^\s*|\s*$/g, '');
      if (bdateStr.length === 2) {
        doc["Date-Of-Birth"] = "";
        hasChanged = true;
      } else {
        var birthYear = parseInt(f.birth_year, 10);
        var birthMonth = parseInt(f.birth_month, 10) - 1;
        var birthDay = parseInt(f.birth_day, 10);
        var bdate = new Date(birthYear, birthMonth, birthDay);
        if ((bdate.getFullYear() === birthYear) 
            && (bdate.getMonth() === birthMonth) 
            && (bdate.getDate() === birthDay)) { // was valid
          if (doc["Date-Of-Birth"] != bdateStr) {   // was changed
            doc["Date-Of-Birth"] = bdateStr;
            hasChanged = true;
          }
        }
      }

      if (doc.Gender != f.gender) {
        doc.Gender = f.gender;
        hasChanged = true;
      }

      if (doc.Conflict != f.vet_type) {
        doc.Conflict = f.vet_type;
        hasChanged = true;
      }

      var branch = f.service_branch;
      if (branch === "Unknown") {
        branch = "";
      }
      if (doc["Branch-of-Service"] != branch) {
        doc["Branch-of-Service"] = branch;
        hasChanged = true;
      }
      if (doc["Service-Dates"] != f.service_dates) {
        doc["Service-Dates"] = f.service_dates;
        hasChanged = true;
      }
      if (doc.Rank != f.service_rank) {
        doc.Rank = f.service_rank;
        hasChanged = true;
      }


      if (doc["Emergency-Contact-Name"] != f.ac_name) {
        doc["Emergency-Contact-Name"] = f.ac_name;
        hasChanged = true;
      }
      if (doc["Emergency-Contact-Phone"] != f.ac_phone) {
        doc["Emergency-Contact-Phone"] = f.ac_phone;
        hasChanged = true;
      }
      if (doc["Emergency-Contact-Email"] != f.ac_email) {
        doc["Emergency-Contact-Email"] = f.ac_email;
        hasChanged = true;
      }

      var usesWheelchair = "No";
      if (f.medical_uses_wheelchair) {
        usesWheelchair = "Yes";
      }
      if (doc["medical-wheelchair"] != usesWheelchair) {
        doc["medical-wheelchair"] = usesWheelchair;
        hasChanged = true;
      }

      var requiresOxygen = "No";
      if (f.medical_requires_oxygen) {
        requiresOxygen = "Yes";
      }
      if (doc["medical-oxygen"] != requiresOxygen) {
        doc["medical-oxygen"] = requiresOxygen;
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
          acceptVetApp(app, f, saveVetApplication, doc);
        } else {
          saveVetApplication(app, doc);
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

function saveVetApplication(app, doc) {
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
//@ sourceURL=/vetedit/submit.js
