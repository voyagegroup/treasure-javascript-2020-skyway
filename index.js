(async function(){
    console.log("hello treasure");
    let localStream;
    try{
        localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        const videoElement = document.getElementById('my-video');
        videoElement.srcObject = localStream;
        videoElement.play();
    } catch (error) {
        alert(error)
    }
    //Peer作成
    const peer = new Peer({
        key: 'f43b2465-bc02-4d13-b7af-ed584aa2451e',
        debug: 3
    });
    // //PeerID取得
    // peer.on('open', () => {
    //     document.getElementById('my-id').textContent = peer.id;
    // });

    console.log(">>>>>>>>>>>")
    console.log(peer)
    document.getElementById('make-call').onclick = () => {
        const meshRoom = peer.joinRoom('room', {
            mode: 'mesh',
            stream: localStream,
        })
        meshRoom.on('open', () => {
            console.log(`join ${peer.id}`)
        })
        meshRoom.on('peerJoin', peerId => {
            console.log(`plus join ${peerId}`)
        });
    }

    // const meshRoom = peer.joinRoom('roomName', {
    //     mode: 'mesh',
    //     stream: localStream,
    // });
    // meshRoom.once('open', () => {
    //     console.log("hoge")
    // })

    // // 発信処理
    // document.getElementById('make-call').onclick = () => {
    //     const theirID = document.getElementById('their-id').value;
    //     const mediaConnection = peer.call(theirID, localStream);
    //     setEventListener(mediaConnection);
    // };

    // // イベントリスナを設置する関数
    // const setEventListener = mediaConnection => {
    //     mediaConnection.on('stream', stream => {
    //         // video要素にカメラ映像をセットして再生
    //         const videoElm = document.getElementById('their-video')
    //         videoElm.srcObject = stream;
    //         videoElm.play();
    //     });
    // }

    // //着信処理
    // peer.on('call', mediaConnection => {
    //     mediaConnection.answer(localStream);
    //     setEventListener(mediaConnection);
    // });

})();