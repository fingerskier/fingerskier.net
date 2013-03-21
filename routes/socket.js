var userNames = (function () {
  var names = {};

  var claim = function (name) {
    console.log('userNames:claim ' + name);
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };

  var getGuestName = function () {
    console.log('userNames:getGuestName');
    var name, nextUserId = 1;

    do {
      name = 'Guest ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  var get = function () {
    console.log('userNames:get');
    var res = [];
    for (user in names) {
      res.push(user);
    }

    return res;
  };

  var free = function (name) {
    console.log('userNames:free ' + name);
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());

module.exports = function (socket) {
  var name = userNames.getGuestName();

  socket.emit('init', {
    name: name,
    users: userNames.get()
  });

  socket.broadcast.emit('user:join', {
    name: name
  });

  socket.on('send:message', function (data) {
    console.log('send:message' + data);
    socket.broadcast.emit('send:message', {
      user: name,
      text: data.message
    });
  });

  socket.on('change:name', function (data, fn) {
    console.log('change:name' + data);
    if (userNames.claim(data.name)) {
      var oldName = name;
      userNames.free(oldName);

      name = data.name;

      socket.broadcast.emit('change:name', {
        oldName: oldName,
        newName: name
      });

      fn(true);
    } else {
      fn(false);
    }
  });

  socket.on('disconnect', function () {
    console.log('disconnect');
    socket.broadcast.emit('user:left', {
      name: name
    });
    userNames.free(name);
  });
};