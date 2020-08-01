(async function(){
    console.log("hello treasure");

    const API_KEY = '9e30e124-19b5-462f-9315-0c8e4ebe5f96';
    
    let localStream;

    try {
        localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
        const videoElement = document.getElementById('my-video')
        videoElement.srcObject = localStream;
        videoElement.play();
    } catch (error) {
        alert(error);
    }

    const peer = new Peer({
        key: API_KEY,
        debug: 3
    });

    // PeerID取得
    peer.on('open', () => {
        document.getElementById('my-id').textContent = peer.id;
    });

    // 発信処理
    document.getElementById('make-call').onclick = () => {
        const theirID = document.getElementById('their-id').value;
        const mediaConnection = peer.call(theirID, localStream);
        setEventListener(mediaConnection);
    };

    // イベントリスナを設置する関数
    const setEventListener = mediaConnection => {
        mediaConnection.on('stream', stream => {
            // video要素にカメラ映像をセットして再生
            const videoElement = document.getElementById('their-video')
            videoElement.srcObject = stream;
            videoElement.play();
        });
    }

    // 着信処理
    peer.on('call', mediaConnection => {
        mediaConnection.answer(localStream);
        setEventListener(mediaConnection);
    });
})();