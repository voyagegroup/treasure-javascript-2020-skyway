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
        key: '5f92eacd-435e-451c-9d67-27f94bcc4096',
        debug: 3
    });
    // PeerId取得(部屋作成みたいな)
    peer.on('open', () => {
        document.getElementById('my-id').textContent = peer.id;
    });

    document.getElementById('make-call').onclick = () => {
        const theirID = document.getElementById('their-id').value;
        const mediaConnection = peer.call(theirID, localStream);
        setEventListener(mediaConnection);
      };

      // イベントリスナを設置する関数
      const setEventListener = mediaConnection => {
        mediaConnection.on('stream', stream => {
          // video要素にカメラ映像をセットして再生
          const videoElm = document.getElementById('their-video')
          videoElm.srcObject = stream;
          videoElm.play();
        });
      }

    //着信処理
    peer.on('call', mediaConnection => {
        mediaConnection.answer(localStream);
        setEventListener(mediaConnection);
    });

  })();