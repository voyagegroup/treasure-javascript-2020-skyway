(async function () {
  console.log("hello treasure");

  const apiKey = "0d86e670-104c-4f9c-8571-008f4f350a9f";

  let localStream;
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      voice: true,
    });
    const videoElement = document.getElementById("my-video");
    videoElement.srcObject = localStream;
    videoElement.play();
  } catch (error) {
    alert(error);
  }

  const peer = new Peer({
    key: apiKey,
    debug: 3,
  });

  // get PeerID
  peer.on("open", () => {
    document.getElementById("my-id").textContent = peer.id;
  });

  // call processing
  document.getElementById("make-call").onclick = () => {
    const theirID = document.getElementById("their-id").value;
    const mediaConnection = peer.call(theirID, localStream);
    setEventListener(mediaConnection);
  };

  // listen event
  const setEventListener = (mediaConnection) => {
    mediaConnection.on("stream", (stream) => {
      const videoElement = document.getElementById("their-video");
      videoElement.srcObject = stream;
      videoElement.play();
    });
  };

  // incoming call processing
  peer.on("call", (mediaConnection) => {
    mediaConnection.answer(localStream);
    setEventListener(mediaConnection);
  });
})();
