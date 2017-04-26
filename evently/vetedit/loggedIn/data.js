function(r) {
  var app = $$(this).app;
  var dbname = app.db.name;

  if (r._rev) {

    var appDate= new Date(Date.parse(r.date_time));

    var birthDateString = "(Imported birth date: " + r["Date-Of-Birth"] + ")";

    var dob = new Date(Date.parse(r["Date-Of-Birth"]));
    var birthDate = "", bdy = "", bdm = "", bdd = "";
    var ageFromBirthDate = "";
    birthDate = dob.toISOString().substring(0, 10);
    var birthDateParts = birthDate.split('-');
    if (birthDateParts.length > 2) {
      bdy = birthDateParts[0];
      bdm = birthDateParts[1];
      bdd = birthDateParts[2];
    }
    var birthYear = dob.getFullYear();
    var thisYear = new Date().getFullYear();
    ageFromBirthDate = "(Age: " + (thisYear - birthYear) + ")";

    if (r.metadata === undefined) {
      r.metadata = {};
    }

    var result = {
        db_name:               dbname,
        id:                    r._id,
        raw_data_lnk:          "(raw data)",
        rev:                   r._rev,
        type:                  r.type,
        vet_type:              (r.Conflict || "WWII"),
        app_date:              appDate.toISOString().substring(0, 10),
        app_date_string:       r.date_time,
        guardian_pref_notes:   r["Guardian-Preference"],
        guardian_pref_phone:   r["Preferred-Guardian-Phone-Number"],
        guardian_pref_email:   r["Preferred-Guardian-Email"],
        first_name:            r["First-Name"],
        middle_name:           r["Middle-Name"],
        last_name:             r["Last-Name"],
        nick_name:             r["Nickname"],
        addr_street:           r.Street,
        addr_city:             r.City,
        addr_county:           r.County,
        addr_state:            r.State,
        addr_zip:              r.Zip,
        addr_phone_day:        r["Primary-Phone"],
        addr_phone_mbl:        r["Mobile-Phone"],
        addr_email:            r.from_email,
        birth_year:            bdy,
        birth_month:           bdm,
        birth_day:             bdd,
        birth_date_string:     birthDateString,
        ageFromBirthDate:      ageFromBirthDate,
        gender:                r.Gender,
        service_branch:        r["Branch-of-Service"],
        service_dates:         r["Service-Dates"],
        service_rank:          r.Rank,
        ac_name:               r["Emergency-Contact-Name"],
        ac_addr_phone:         r["Emergency-Contact-Phone"],
        ac_addr_email:         r["Emergency-Contact-Email"],
        app_status:            (r.app_status || "New"),
        app_status_note:       (r.app_status_note || ""),
        created_at:            (r.metadata.created_at || appDate.toISOString().substring(0,19) + "Z"),
        updated_at:            (r.metadata.updated_at || ""),
        created_by:            (r.metadata.created_by || "Online App"),
        updated_by:            (r.metadata.updated_by || "")
    }


    var selectedBranch = "selBranch-" + r["Branch-of-Service"].split(' ').join('_');
    result[selectedBranch] = "selected";
    var selectedVetType = "selVetType-" + (r.Conflict || "WWII");
    result[selectedVetType] = "selected";
    var selectedGender = "selGender-" + (r.Gender.substring(0, 1) || "M");
    result[selectedGender] = "selected";
    var selectedAppStatus = "selStatus-" + (r.app_status || "New");
    result[selectedAppStatus] = "selected";

    if (r["medical-wheelchair"] === "Yes") {
      result["selMed-wc"] = "checked='yes'";
    }
    if (r["medical-oxygen"] === "Yes") {
      result["selMed-oxygen"] = "checked='yes'";
    }

  }

  return result;
}

//@ sourceURL=/vetedit/data.js
