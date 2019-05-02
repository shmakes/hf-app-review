function(doc) {
  if (doc.date_time) {
    var dw = doc.date_time;
    if (dw.match(/^\d/)) {
      dw = dw.replace(" ", "T");
    }
    var dw = new Date(dw);
    dw.setHours(0,0,0,0);
    dw.setDate(dw.getDate() + 4 - (dw.getDay()||7));
    var yearStart = new Date(dw.getFullYear(),0,1);
    var weekNo = Math.ceil(( ( (dw - yearStart) / 86400000) + 1)/7);
    var dd = new Date(doc.date_time);
    emit([doc.app_status, doc.type, dw.getFullYear(), dw.getMonth()+1, weekNo, dd.getDate(), dd.getHours()], 1);
  }
}
