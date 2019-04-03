'use strict';

exports.ok = function(values, res) {
  var data = {
      'status': 200,
      'values': values
  };
  res.json(data);
  res.end();
};

exports.NotOk = function(values, res) {
  var data = {
      'status': 409,
      'values': values
  };
  res.json(data);
  res.end();
};
