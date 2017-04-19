function(cb) {
  var app = $$(this).app;
  var docid = app.req.query.grdid;
  //$.log("docid: " + docid)

  if (docid.length == 32) {
    app.db.openDoc(docid, {
      success : function(doc) {
        cb(doc);
      }
    });
  } else if (docid == 'New') {
    doc = {};
    cb(doc);
  }
};

//@ sourceURL=/grdedit/async.js
