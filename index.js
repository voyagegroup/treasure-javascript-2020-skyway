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

  // chat
  const localId = document.getElementById("js-local-id");
  const localText = document.getElementById("js-local-text");
  const closeTrigger = document.getElementById("js-close-trigger");
  const sendTrigger = document.getElementById("js-send-trigger");
  const remoteId = document.getElementById("js-remote-id");
  const messages = document.getElementById("js-messages");

  // localStream ... ビデオ、音声データ
  const localStream = await navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .catch((err) => alert("mediaDevice.getUserMedia() error:", err));
  myVideo.srcObject = localStream;
  myVideo.play();

  const peer = new Peer({
    key: "1212399c-448f-4135-89d3-76deff99795a",
    debug: 3,
  });

  // skywayサーバーとの接続準備OK
  peer.once("open", (id) => (localId.textContent = id));

  // 相手から接続要求がきた時
  peer.on("call", (mediaConnection) => {
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

  const setEventListener = (mediaConnection) => {
    mediaConnection.on("stream", (stream) => {
      theirVideo.srcObject = stream;
      theirVideo.play();
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

  peer.on("error", (err) => {
    alert(err.message);
  });
})();
