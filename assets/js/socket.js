import {
  Socket
} from "phoenix";

import filesize from "./filesize";

let socket = new Socket("/socket", {
  params: {
    token: window.userToken
  }
});

socket.connect();

let stats_channel = socket.channel("stats", {});
let ctrl_channel = socket.channel("ctrl", {});

stats_channel.join()
  .receive("ok", resp => {
    console.log("Joined stats successfully", resp);
  })
  .receive("error", resp => {
    console.log("Unable to join stats", resp);
  });

ctrl_channel.join()
  .receive("ok", resp => {
    console.log("Joined ctrl successfully", resp);
  })
  .receive("error", resp => {
    console.log("Unable to join ctrl channel", resp);
  });

stats_channel.push("stats", {
  body: "hdd"
});

setInterval(function () {
  stats_channel.push("stats", {
    body: "hdd"
  });
}, 3000);

stats_channel.on("hdd", response => {
  document.getElementById("hdd_size").innerHTML = filesize(response.size);
  document.getElementById("hdd_used").innerHTML = response.used + "%";
  document.getElementById("incomp_size").innerHTML = filesize(response.incmp_size);
  document.getElementById("cpu_util").innerHTML = parseInt(filesize(response.cpu_util)) + "%";
});

window.onload = function () {
  document.getElementById("del_incomp").onclick = function (e) {
    e.preventDefault();
    stats_channel.push("stats", {
      body: "del_incomp"
    });
  };

  document.getElementById("poweroff").onclick = function (e) {
    e.preventDefault();
    ctrl_channel.push("ctrl", {
      body: "poweroff"
    });
  };

  document.getElementById("reboot").onclick = function (e) {
    e.preventDefault();
    ctrl_channel.push("ctrl", {
      body: "reboot"
    });
  };
};

export default socket;