var apiHost="";
var apiHoststr = window.location.href.split("?")[0].split("//")[1].split(":")[0];
if(apiHoststr!="www.xstudio.pub" && apiHoststr != "127.0.0.1"){
    apiHost="https://www.xstudio.pub";
}
if (apiHoststr == "127.0.0.1") {
  apiHost = "http://127.0.0.1";
}

function get(Key) {
    return localStorage.getItem(Key);
  }
function remove(key) {
    localStorage.removeItem(key);
}
function set(Key,val) {
    return localStorage.setItem(Key,val);
}
