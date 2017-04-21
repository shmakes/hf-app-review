function(doc) {
  if ((doc.type) 
      && (doc.date_time)
      && ((doc.type == "VeteranApp") 
        || (doc.type == "GuardianApp"))
      && ((doc.disposition === undefined)
        || (doc.disposition == "Edited"))) {
    var appStatus = doc.app_status || "New";
    var appDate = new Date(Date.parse(doc.date_time)).toISOString();
    emit([appStatus, appDate], {
      "type": doc.type,
      "appdate": appDate,
      "app_status": appStatus,
      "name": doc["First-Name"] + " " + doc["Last-Name"],
      "city": doc.City + " " + doc.State,
      "pairing": doc["Guardian-Preference"] || doc["Veteran-Preference"] || "",
      "email": doc.from_email,
      "ipaddr": doc.ip_address
    });
  }
}
