(async function () {
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
  const peer = new Peer({
    key: "0e95c6b0-edb4-4681-a1ea-0b948bccb9dc",
    debug: 3,
  });
  // PeerID取得
  peer.on("open", () => {
    document.getElementById("my-id").textContent = peer.id;
  });
  // 発信処理
  document.getElementById("make-call").onclick = () => {
    const theirID = document.getElementById("their-id").value;
    const mediaConnection = peer.call(theirID, localStream);
    setCallEventListener(mediaConnection);
  };

  // イベントリスナ
  // 通話が繋がったときに相手の画面の表示
  const setCallEventListener = (mediaConnection) => {
    // 通話開始イベント
    mediaConnection.on("stream", (stream) => {
      const videoElement = document.getElementById("their-video");
      videoElement.srcObject = stream;
      videoElement.play();

      // 切断イベント
      mediaConnection.on("close", () => {
        alert("通信が切断しました。");
        const videoElement = document.getElementById("their-video");
        videoElement.load();
      });

      // 能動的切断
      document.getElementById("close-call").addEventListener('click', () => mediaConnection.close(true))
    });
  };

  // 着信処理
  peer.on("call", (mediaConnection) => {
    mediaConnection.answer(localStream);
    setCallEventListener(mediaConnection);
  });
})();
