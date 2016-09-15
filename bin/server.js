#!/usr/bin/env node
'use strict';

var app = require('../app');
var PORT = process.env.PORT || 8888;

app.listen(PORT, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('server listening on port ' + PORT);
  }
});
