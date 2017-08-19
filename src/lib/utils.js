/*
  utils.js V. 0.3.0
*/

"use strict";

require('./commands').forEach(function (command) {
  require('./utils/' + command);
});
