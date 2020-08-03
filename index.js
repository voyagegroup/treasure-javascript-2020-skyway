// 今週中にpull requestを投げる！

(async function () {
  // video
  const myVideo = document.getElementById("my-video");
  const theirVideo = document.getElementById("their-video");
  const theirID = document.getElementById("their-id");
  const connectTrigger = document.getElementById("js-connect-trigger");
  const disconnectTrigger = document.getElementById("js-disconnect-trigger");
  const permitTrigger = document.getElementById("js-permit-trigger");
  const rejectTrigger = document.getElementById("js-reject-trigger");
  const cameraTrigger = document.getElementById("js-camera-trigger");
  const cameraStatus = document.getElementById("js-camera-status");
  const microphoneTrigger = document.getElementById("js-microphone-trigger");
  const microphoneStatus = document.getElementById("js-microphone-status");

  // chat
  const localId = document.getElementById("js-local-id");
  const localText = document.getElementById("js-local-text");
  const closeTrigger = document.getElementById("js-close-trigger");
  const sendTrigger = document.getElementById("js-send-trigger");
  const messages = document.getElementById("js-messages");

  // display
  const myDisplay = document.getElementById("my-display");
  const theirDisplay = document.getElementById("their-display");
  const shareTrigger = document.getElementById("js-share-trigger");

  // localStream ... ビデオ、音声データ
  let localStream = await navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .catch((err) => alert("mediaDevice.getUserMedia() error:", err));
  myVideo.srcObject = localStream;
  myVideo.play();

  // displayStream: 画面共有
  const displayStream = await navigator.mediaDevices
    .getDisplayMedia({ video: true })
    .catch((err) => alert("mediaDevice.getDisplayMedia() error:", err));

  cameraTrigger.addEventListener("click", () => {
    localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
    cameraStatus.textContent = localStream.getVideoTracks()[0].enabled ? "ON" : "OFF";
  });

  microphoneTrigger.addEventListener("click", () => {
    localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
    microphoneStatus.textContent = localStream.getAudioTracks()[0].enabled ? "ON" : "OFF";
  });

  const peer = new Peer({
    key: "1212399c-448f-4135-89d3-76deff99795a",
    debug: 3,
  });

  // skywayサーバーとの接続準備OK
  peer.once("open", (id) => (localId.textContent = id));

  // 相手から接続要求がきた時
  peer.on("call", async (mediaConnection) => {
    // default: audio muted
    localStream.getAudioTracks()[0].enabled = false;
    mediaConnection.answer(localStream);
    setEventListener(mediaConnection);

    // permit
    // permitTrigger.onclick = () => {
    //   mediaConnection.answer(localStream);
    //   setEventListener(mediaConnection);
    // };
  });

  // 発信処理
  // media connection
  connectTrigger.onclick = () => {
    // 相手のPeerIDとデータストリームをセットで送りつける
    const mediaConnection = peer.call(theirID.value, localStream);
    setEventListener(mediaConnection);
  };

  shareTrigger.onclick = () => {
    // 画面共有
    const displayConnection = peer.call(theirID.value, displayStream);
    setEventListener2(displayConnection);
  };

  const setEventListener = (mediaConnection) => {
    mediaConnection.on("stream", (stream) => {
      theirVideo.srcObject = stream;
      theirVideo.play();
    });
  };

  const setEventListener2 = (mediaConnection) => {
    mediaConnection.on("stream", (stream) => {
      theirDisplay.srcObject = stream;
      theirDisplay.play();
    });
  };

  // バン
  disconnectTrigger.onclick = () => {
    peer.destroy();
  };

  peer.on("close", () => {
    alert("接続が切れました");
  });

  // chat
  // Register connecter handler
  // dataConnection
  connectTrigger.addEventListener("click", () => {
    const dataConnection = peer.connect(theirID.value);

    dataConnection.once("open", async () => {
      messages.textContent += `=== DataConnection has been opened ===\n`;
      sendTrigger.addEventListener("click", onClickSend);
    });

    dataConnection.on("data", (data) => {
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

  // Register connected peer handler
  peer.on("connection", (dataConnection) => {
    dataConnection.once("open", async () => {
      messages.textContent += `=== DataConnection has been opened ===\n`;

      sendTrigger.addEventListener("click", onClickSend);
    });

    dataConnection.on("data", (data) => {
      messages.textContent += `Remote: ${data}\n`;
    });

    dataConnection.once("close", () => {
      messages.textContent += `=== DataConnection has been closed ===\n`;
      sendTrigger.removeEventListener("click", onClickSend);
    });

    // Register closing handler
    disconnectTrigger.addEventListener("click", () => dataConnection.close(), {
      once: true,
    });

    function onClickSend() {
      const data = localText.value;
      dataConnection.send(data);

      messages.textContent += `You: ${data}\n`;
      localText.value = "";
    }
  });

  peer.on("error", (err) => {
    alert(err.message);
  });
})();
