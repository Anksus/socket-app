const socket = io();

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("message", message, (error) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message delivered!");
  });
});

document.querySelector("#location-btn").addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("Your browser doesn't supports location sharing");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "share-location",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (error) => {
        if (error) {
          console.log(error);
        }
        console.log("Location delivered");
      }
    );
  });
});

socket.on("display-text", (message) => {
  console.log(message);
});

socket.on("welcome", () => {
  console.log("welcome new user");
});
