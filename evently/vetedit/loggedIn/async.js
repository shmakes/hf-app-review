function(cb) {
  var app = $$(this).app;
  var docid = app.req.query.vetid;
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

//@ sourceURL=/vetedit/async.js
