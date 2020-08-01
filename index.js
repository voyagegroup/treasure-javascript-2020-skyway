(async function () {
  console.log("hello treasure");
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
    setEventListener(mediaConnection);
  };
  // イベントリスナ
  const setEventListener = (mediaConnection) => {
    mediaConnection.on("stream", (stream) => {
      const videoElement = document.getElementById("their-video");
      videoElement.srcObject = stream;
      videoElement.play();
    });
  };
  // 着信処理
  peer.on("call", (mediaConnection) => {
    mediaConnection.answer(localStream);
    setEventListener(mediaConnection);
  });
})();
