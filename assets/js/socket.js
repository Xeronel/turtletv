import {
  Socket
} from "phoenix";

import filesize from "./filesize";

let socket = new Socket("/socket", {
  params: {
    token: window.userToken
  }
});

socket.connect()

let channel = socket.channel("stats", {})
channel.join()
  .receive("ok", resp => {
    console.log("Joined successfully", resp)
  })
  .receive("error", resp => {
    console.log("Unable to join", resp)
  });

channel.push("stats", {});

setInterval(function () {
  channel.push("stats", {
    body: "hdd"
  });
}, 3000);

channel.on("hdd", response => {
  document.getElementById("hdd_size").innerHTML = filesize(response.size);
  document.getElementById("hdd_used").innerHTML = response.used + "%";
  document.getElementById("incomp_size").innerHTML = filesize(response.incmp_size);
  document.getElementById("cpu_util").innerHTML = parseInt(filesize(response.cpu_util)) + "%";
});

document.getElementById("del_incomp").onclick = function (e) {
  channel.push("stats", {
    body: "del_incomp"
  });
  e.preventDefault();
}

export default socket;