(async function() {
  const remoteId = document.getElementById("their-id");
  const localText = document.getElementById("js-local-text");
  const conncetTrigger = document.getElementById("make-call");
  const sendTrigger = document.getElementById("js-send-trigger");
  const messages = document.getElementById("js-messages");

  console.log("hello treasure");
  let localStream;
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const videoElement = document.getElementById("my-video");
    videoElement.srcObject = localStream;
    videoElement.play();
  } catch (error) {
    alert(error);
  }

  //Peer作成
  const peer = new Peer({
    key: "c1f3ecfd-8244-4e62-8672-9827afcd0e9a",
    debug: 3,
  });

  conncetTrigger.addEventListener("click", () => {
    if (!peer.open) {
      return;
    }
    const dataConnection = peer.connect(remoteId.value);

    dataConnection.once("open", async () => {
      messages.textContent += "=== DataConnection has been opened ===\n";

      sendTrigger.addEventListener("click", onClickSend);
    });

    dataConnection.on("data", (data) => {
      messages.textContent += `Remote: ${data}\n`;
    });

    function onClickSend() {
      const data = localText.value;
      dataConnection.send(data);

      messages.textContent += `You: ${data}\n`;
      localText.value = "";
    }
  });

  //PeerID取得
  peer.on("open", () => {
    document.getElementById("my-id").textContent = peer.id;
  });

  // 発信処理
  document.getElementById("make-call").onclick = () => {
    const theirID = document.getElementById("their-id").value;
    const mediaConnection = peer.call(theirID, localStream);
    setEventListener(mediaConnection);
  };

  // イベントリスナを設置する関数
  const setEventListener = (mediaConnection) => {
    mediaConnection.on("stream", (stream) => {
      // video要素にカメラ映像をセットして再生
      const videoElm = document.getElementById(`their-video`);
      videoElm.srcObject = stream;
      videoElm.play();
    });
  };

  //着信処理
  peer.on("call", (mediaConnection) => {
    mediaConnection.answer(localStream);
    setEventListener(mediaConnection);
  });

  //テキストチャット
  peer.on("connection", (dataConnection) => {
    dataConnection.once("open", async () => {
      messages.textContent += `=== DataConnection has been opened ===\n`;

      sendTrigger.addEventListener("click", onClickSend);
    });

    dataConnection.on("data", (data) => {
      messages.textContent += `Remote: ${data}\n`;
    });

    function onClickSend() {
      const data = localText.value;
      dataConnection.send(data);

      messages.textContent += `You: ${data}\n`;
      localText.value = "";
    }
  });
})();
