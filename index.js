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

    const peer = new Peer({
      key: "34641ac1-97a3-4d80-b668-71bbfc8da928",
      debug: 3,
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
        const videoElm = document.getElementById("their-video");
        videoElm.srcObject = stream;
        videoElm.play();
      });
    };

    //着信処理
    peer.on("call", (mediaConnection) => {
      mediaConnection.answer(localStream);
      setEventListener(mediaConnection);
    });
  } catch (error) {
    alert(error);
  }
})();
