/*
Original from https://github.com/pkrumins/node-passwd a great!
author : Peteris Krumins
email  : peteris.krumins@gmail.com
url    : http://www.catonmat.net
twitter: http://twitter.com/pkrumins
*/

import fs from "fs";
import { spawn } from "child_process";

function generateSalt(n) {
  var salt = [];
  var alphabet =
    "abcdefghijklmnopqrstuvqxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < n; i++)
    salt.push(alphabet[parseInt(Math.random() * alphabet.length)]);
  return salt.join("");
}

function shadowPass(pass, cb) {
  var salt = generateSalt(8);
  var openssl = spawn("openssl", ["passwd", "-1", "-salt", salt, pass]);
  openssl.stdout.on("data", function(buf) {
    cb(buf.toString().slice(0, -1));
  });
}

function add(username, pass, opts, cb) {
  var opts = opts || {};
  var cb = cb || function() {};
  shadowPass(pass, function(shadowPass) {
    var useraddOpts = [];
    if (opts.createHome) useraddOpts.push("-m");
    if (opts.group) useraddOpts = useraddOpts.concat(["-g", opts.group]);
    if (opts.shell) useraddOpts = useraddOpts.concat(["-s", opts.shell]);
    useraddOpts = useraddOpts.concat(["-p", shadowPass]);
    useraddOpts.push(username);
    var cmd = "useradd";
    if (opts.sudo) {
      cmd = "sudo";
      useraddOpts = ["useradd"].concat(useraddOpts);
    }
    var passwd = spawn(cmd, useraddOpts);
    passwd.on("exit", function(code, signal) {
      cb(code);
    });
  });
}

function del(username, opts, cb) {
  var opts = opts || {};
  var cb = cb || function() {};
  var cmd = "userdel";
  var args = [username];
  if (opts.sudo) {
    cmd = "sudo";
    args = ["userdel"].concat(args);
  }
  var passwd = spawn(cmd, args);
  passwd.on("exit", function(code, signal) {
    cb(code);
  });
}

function lock(username, opts, cb) {
  var opts = opts || {};
  var cb = cb || function() {};
  var cmd = "usermod";
  var args = ["-L", username];
  if (opts.sudo) {
    cmd = "sudo";
    args = ["usermod"].concat(args);
  }
  var passwd = spawn(cmd, args);
  passwd.on("exit", function(code, signal) {
    cb(code);
  });
}

function unlock(username, opts, cb) {
  var opts = opts || {};
  var cb = cb || function() {};
  var cmd = "usermod";
  var args = ["-U", username];
  if (opts.sudo) {
    cmd = "sudo";
    args = ["usermod"].concat(args);
  }
  var passwd = spawn(cmd, args);
  passwd.on("exit", function(code, signal) {
    cb(code);
  });
}

function passwd(username, pass, opts, cb) {
  var opts = opts || {};
  var cb = cb || function() {};
  shadowPass(pass, function(shadowPass) {
    var cmd = "usermod";
    var args = ["-p", shadowPass, username];
    if (opts.sudo) {
      cmd = "sudo";
      args = ["usermod"].concat(args);
    }
    var passwd = spawn(cmd, args);
    passwd.on("exit", function(code, signal) {
      cb(code);
    });
  });
}

function get(username, cb) {
  getAll(function(users) {
    //var foundUser = false;
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      if (user.username == username) {
        cb(user);
        return;
      }
    }
    cb(null);
  });
}

function getAll(cb) {
  fs.readFile("/etc/passwd", function(err, users) {
    if (err) {
      console.log("err");
      throw err;
    } else {
      cb(
        users
          .toString()
          .split("\n")
          .filter(function(user) {
            return user.length && user[0] != "#";
          })
          .map(function(user) {
            var fields = user.split(":");
            return {
              username: fields[0],
              password: fields[1],
              userId: fields[2],
              groupId: fields[3],
              name: fields[4],
              homedir: fields[5],
              shell: fields[6]
            };
          })
      );
    }
  });
}

export { shadowPass, add, del, lock, unlock, passwd, get, getAll };
