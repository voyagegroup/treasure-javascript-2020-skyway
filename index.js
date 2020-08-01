// 今週中にpull requestを投げる！

(async function () {
  console.log("hello treasure");
  let localStream;
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const videoElement = document.getElementById("my-video");
    videoElement.srcObject = localStream;
    videoElement.play();
  } catch (error) {
    alert(error);
  }
  const peer = new Peer({
    key: "1212399c-448f-4135-89d3-76deff99795a",
    debug: 3,
  });

  peer.on("open", () => {
    document.getElementById("my-id").textContent = peer.id;
  });

  document.getElementById("make-call").onclick = () => {
    const theirID = document.getElementById("their-id").value;
    const mediaConnection = peer.call(theirID, localStream);
    setEventListener(mediaConnection);
  };

  const setEventListener = (mediaConnection) => {
    mediaConnection.on("stream", (stream) => {
      const videoElement = document.getElementById("their-video");
      videoElement.srcObject = stream;
      videoElement.play();
    });
  };

  peer.on("call", (mediaConnection) => {
    mediaConnection.answer(localStream);
    setEventListener(mediaConnection);
  });

  // コピペ
  const localId = document.getElementById("js-local-id");
  const localText = document.getElementById("js-local-text");
  const connectTrigger = document.getElementById("js-connect-trigger");
  const closeTrigger = document.getElementById("js-close-trigger");
  const sendTrigger = document.getElementById("js-send-trigger");
  const remoteId = document.getElementById("js-remote-id");
  const messages = document.getElementById("js-messages");
  const meta = document.getElementById("js-meta");
  const sdkSrc = document.querySelector("script[src*=skyway]");

  connectTrigger.addEventListener("click", () => {
    const dataConnecton = peer.connect(remoteId.value);

    dataConnection.on("data", (data) => {
      messages.textContent += `Remote: ${data}\n`;
    });

    dataConnecton.once("close", () => {
      messages.textContent += `Remote: ${data}\n`;
    });

    dataConnection.once("close", () => {
      messages.textContent += `=== DataConnection has been closed ===\n`;
      sendTrigger.removeEventListener("click", onClickSend);
    });

    // Register closing handler
    closeTrigger.addEventListener("click", () => dataConnection.close(), {
      once: true,
    });

    function onClickSend() {
      const data = localText.value;
      dataConnection.send(data);

      messages.textContent += `You: ${data}\n`;
      localText.value = "";
    }
  });
})();
