$.couch.app(function(app) {  
  $("#grdedit").evently("grdedit", app);
  $.evently.connect($("#account"), $("#grdedit"), ["loggedIn", "loggedOut"]);
});

function acceptGrdApp(app, f, saveGrdApplication, grdAppDoc) {

  var logisticsDb = getLogisticsDb(app);

  function saveDoc(doc) {
    var user = $("#user_name").text();
    var timestamp = ISODateString(new Date());

    doc.type = "Guardian";

    if (!doc.name) {
      doc.name = {};
    }
    if (doc.name.first != f.first_name) {
      doc.name.first = f.first_name;
    }
    if (doc.name.last != f.last_name) {
      doc.name.last = f.last_name;
    }
    if (doc.name.middle != f.middle_name) {
      doc.name.middle = f.middle_name;
    }

    if (!doc.address) {
      doc.address = {};
    }
    if (doc.address.street != f.street) {
      doc.address.street = f.street;
    }
    if (doc.address.city != f.city) {
      doc.address.city = f.city;
    }
    if (doc.address.county != f.county) {
      doc.address.county = f.county;
    }
    if (doc.address.state != f.state.toUpperCase()) {
      doc.address.state = f.state.toUpperCase();
    }
    if (doc.address.zip != f.zip) {
      doc.address.zip = f.zip;
    }
    if (doc.address.phone_day != f.phone_day) {
      doc.address.phone_day = f.phone_day;
    }
    if (doc.address.phone_mbl != f.phone_mbl) {
      doc.address.phone_mbl = f.phone_mbl;
    }
    if (doc.address.email != f.email) {
      doc.address.email = f.email;
    }

    if (doc.app_date != f.app_date) {
        doc.app_date = f.app_date;
    }

    if (!doc.call) {
      doc.call = {};
      doc.call.history = [];
      doc.call.assigned_to = "";
      doc.call.fm_number = "";
      doc.call.mail_sent = false;
      doc.call.email_sent = false;
    }

    if (!doc.mail_call) {
      doc.mail_call = {};
      doc.mail_call.name = "";
      doc.mail_call.relation= "";
      doc.mail_call.address = {};
      doc.mail_call.address.phone = "";
      doc.mail_call.address.email = "";
    }

    if (!doc.flight) {
      doc.flight = {};
      doc.flight.history = [];
      doc.flight.id = "None";
      doc.flight.confirmed_date = "";
      doc.flight.confirmed_by = "";
      doc.flight.seat = "";
      doc.flight.group = "";
      doc.flight.bus = "None";
      doc.flight.status = "Active";
      doc.flight.status_note = "";
      doc.flight.training_complete = false;
      doc.flight.paid = false;
      doc.flight.waiver = false;
      doc.flight.booksOrdered = 0;

    }

    if (!doc.veteran) {
      doc.veteran = {};
      doc.veteran.pref_notes = "";
      doc.veteran.pairings = [];
      doc.veteran.history = [];
    }
    if ('veteran_pref_notes' in f && f.veteran_pref_notes != doc.veteran.pref_notes) {
      doc.veteran.pref_notes = f.veteran_pref_notes;
    }

    var bdateStr = f.birth_year.replace(/^\s*|\s*$/g, '') + "-" + f.birth_month.replace(/^\s*|\s*$/g, '') + "-" + f.birth_day.replace(/^\s*|\s*$/g, '');
    if (bdateStr.length === 2) {
      doc.birth_date = "";
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
        }
      }
    }

    if (doc.gender != f.gender.charAt(0).toUpperCase()) {
      doc.gender = f.gender.charAt(0).toUpperCase();
    }

    if (!doc.emerg_contact) {
      doc.emerg_contact = {};
    }
    if (doc.emerg_contact.name != f.ec_name) {
      doc.emerg_contact.name = f.ec_name;
    }
    if (!doc.emerg_contact.address) {
      doc.emerg_contact.address = {};
    }
    if (doc.emerg_contact.address.phone != f.ec_phone) {
      doc.emerg_contact.address.phone = f.ec_phone;
    }
    if (doc.emerg_contact.address.email != f.ec_email) {
      doc.emerg_contact.address.email = f.ec_email;
    }

    if (!doc.medical) {
      doc.medical = {};
        doc.medical.release = false;
        doc.medical.can_push = false;
        doc.medical.can_lift = false;
        doc.medical.limitations = false;
        doc.medical.experience = false;
        doc.medical.level = "";
    }

    if (!doc.shirt) {
      doc.shirt = {};
      doc.shirt.size = "";
    }

    if (!doc.notes) {
      doc.notes = {};
    }

    if (!doc.weight) {
      doc.weight = "";
    }

    if (!doc.apparel) {
      doc.apparel = {};
      doc.apparel.item = "None";
      doc.apparel.date = "";
      doc.apparel.delivery = "None";
      doc.apparel.by = "";
      doc.apparel.notes = "";
    }

    if (!doc.metadata) {
      doc.metadata = {};
      doc.metadata.created_at = f.created_at;
      doc.metadata.created_by = f.created_by + " (" + user + ")";
    }
    doc.metadata.updated_at = timestamp;
    doc.metadata.updated_by = user;


    logisticsDb.saveDoc(doc, {
      success : function(resp) {
        $("#SavedToWaitlist").html("Application Saved to Waitlist");
        grdAppDoc["acceptedAsRev"] = resp.rev;
        saveGrdApplication(app, grdAppDoc);
      }
    });
    return false;
  };

  if (f._rev) {
    logisticsDb.openDoc(f._id, {
      error : function() {
        saveDoc( { "_id" : f._id } );
      },
      success : function(doc) {
        if (doc._rev === grdAppDoc.acceptedAsRev) {
          saveDoc(doc);
        } else {
          $("#SavedToWaitlist").html("Could not save to waitlist. Already modified there.");
          saveGrdApplication(app, grdAppDoc);
        }
      }
    });
  }
  return false;
};
