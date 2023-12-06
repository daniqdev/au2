const scriptVersion = "1.10";

const minRoomSwitcherDelayInMilliseconds = 30000 * 1;
const maxRoomSwitcherDelayInMilliseconds = 60000 * 1;

const isDebugModeEnabled = true;
const isRoomSwitcherEnabled = true;

let currentRoomId = 153;

console.info("Startup ⚡️", `Au2 Script v${scriptVersion} initialized`);
console.info(
  "Startup ⚡️",
  `Delay is set to somewhere between ${new Date(
    minRoomSwitcherDelayInMilliseconds
  ).getMinutes()} → ${new Date(
    maxRoomSwitcherDelayInMilliseconds
  ).getMinutes()} minutes`
);
console.info("Startup ⚡️", `Debug mode enabled: ${isDebugModeEnabled}`);
console.info("Startup ⚡️", `Room switcher enabled: ${isRoomSwitcherEnabled}`);

/*
The following code will detect whenever WebSocket disconnects.
*/
window.socket.onclose = (e) => {
  console.warn("Disconnected 🔥", e);
  window.location.reload();
};

/*
The following code will run whenever a message is received via WebSocket.
If debug mode is enabled (isDebug), we print the incoming message to the Console.
Checks every incoming message for recieved hours, then extracts the current 
hour and token and recognise said message.
*/
socket.addEventListener("message", function (e) {
  var data = e.data;
  if (isDebugModeEnabled) {
    console.debug("Debug 👷", data);
  }

  if (data.substr(0, 7) == "3,hour,") {
    var params = data.substr(7).split(":");
    var hour = params[0],
      token = params[1];

    setTimeout(function () {
      WebSocket.prototype.send.call(window.socket, "3,time," + token);
      console.info("Received hour 🎉", hour);
    }, Math.floor(Math.random() * 29000) + 1000);
  }
});

/*
The following code will loop through room '153' -> '157'.
Prints out the next room number to the console and then
sends /goto <roomId> as a chat message in order to switch to the given room.
If the roomId exceeds 157, we set it to the initial roomId.
*/
const roomSwitcher = () => {
  console.info("Switching room 🔀", currentRoomId);

  onChatType(`/goto ${currentRoomId}`);
  currentRoomId++;

  if (currentRoomId >= 157) currentRoomId = 153;
};

if (isRoomSwitcherEnabled) {
  if (minRoomSwitcherDelayInMilliseconds > maxRoomSwitcherDelayInMilliseconds) {
    console.warn(
      "Delay mismatch 🔥",
      "Please set minRoomSwitcherDelayInMilliseconds to a value less than maxRoomSwitcherDelayInMilliseconds"
    );
  } else {
    setInterval(
      () => {
        roomSwitcher();
      },
      minRoomSwitcherDelayInMilliseconds,
      maxRoomSwitcherDelayInMilliseconds
    );
  }
}
