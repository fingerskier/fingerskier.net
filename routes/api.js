// JSON service for AngularJS

exports.action = function(req, res) {
  var response = {
    URL: "/api/action/dataIfAny"
  };

  if (req.params) {
    respones = {};

    for (var key in req.params)
      response[key] = req.params[key];
  }

  res.json(response);
}

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};