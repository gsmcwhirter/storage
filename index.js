var cookie = require('cookie')
  , json = require('json')
  , inherit = require('inherit')
  ;
  
module.exports = AutoStorage;
  
function AutoStorage(sname){
  var type = detectStorageType();
  return new type(sname);
}

AutoStorage.MemoryStorage = Storage;
AutoStorage.CookieStorage = CookieStorage;
AutoStorage.LocalStorage = LocalStorage;
AutoStorage.SessionStoreage = SessionStorage; 

function detectStorageType(no_cookies){
  if (typeof window.localStorage === 'object'){
    return LocalStorage;
  }
  
  if (!no_cookies){
    return CookieStorage;
  }
  
  return Storage;
}

function Storage(sname){
  this.storage_name = sname;
  this.data = {};
  this.load();
}

Storage.prototype.get = function (key){
  return this.data[key];
};

Storage.prototype.set = function (key, val){
  this.data[key] = val;
  this.save();
};

Storage.prototype.save = function (){};
Storage.prototype.load = function (){};

function CookieStorage(sname, opts){
  this.storage_name = sname;
  this.data = {};
  this.opts = opts || {path: '/', maxage: 60000};
  this.load();
}
inherit(CookieStorage, Storage);

CookieStorage.prototype.save = function (){
  cookie(this.storage_name, json.stringify(this.data), this.opts);
};

CookieStorage.prototype.load = function (){
  this.data = cookie(this.storage_name) || {};
};

function LocalStorage(sname){
  this.storage_name = sname;
  this.data = {};
  this.load();
}
inherit(LocalStorage, Storage);

LocalStorage.prototype.save = function (){
  localStorage.setItem(this.storage_name, json.stringify(this.data));
};

LocalStorage.prototype.load = function (){
  this.data = json.parse(localStorage.getItem(this.storage_name) || "{}");
};

function SessionStorage(sname){
  this.storage_name = sname;
  this.data = {};
  this.load();
}
inherit(SessionStorage, Storage);

SessionStorage.prototype.save = function (){
  sessionStorage.setItem(this.storage_name, json.stringify(this.data));
};

SessionStorage.prototype.load = function (){
  this.data = json.parse(sessionStorage.getItem(this.storage_name) || "{}");
};
