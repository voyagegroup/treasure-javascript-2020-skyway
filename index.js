(async function(){
    let localStream;

    try{
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const videoElement = document.getElementById('my-video');
        videoElement.srcObject = localStream
        videoElement.play()
    }
    catch(error){
        alert(error)
    }
    // peer id　の取得
    const peer = new Peer({
        key: 'f4314d6c-ad3c-450c-90df-2811611d4a25',
        debug: 3
      });

    peer.on('open', () => {
        document.getElementById('my-id').textContent = peer.id;
    });

    // 発進処理
    document.getElementById('make-call').onclick = () => {
        const theirID = document.getElementById('their-id').value;
        const mediaConnection = peer.call(theirID, localStream);
        setEventListener(mediaConnection);
    };


    const setEventListener = mediaConnection => {
        mediaConnection.on('stream', stream => {
          // video要素にカメラ映像をセットして再生
          const videoElm = document.getElementById('their-video')
          videoElm.srcObject = stream;
          videoElm.play();
        });
        }


    peer.on('call', mediaConnection => {
        mediaConnection.answer(localStream);
        setEventListener(mediaConnection);
    });


    peer.on('error', console.error);

    peer.on('close', () => {
        alert("hogehoge")
    });

})();
