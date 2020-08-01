(async function () {
    console.log("hello treasure");
    let localStream;
    try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const videoElement = document.getElementById('my-video');
        videoElement.srcObject = localStream;
        videoElement.play();
    } catch (error) {
        alert(error);
    }
    const peer = new Peer({
        key: 'd35f0980-bf6c-4734-97cc-5e7ede92e388',
        debug: 3
    });

    peer.on('open', () => {
        document.getElementById('my-id').textContent = peer.id;
    });

    //以下発信処理
    document.getElementById('make-call').onclick = () => {
        const theirID = document.getElementById('their-id').value;
        const mediaConnection = peer.call(theirID, localStream);
        setEventLister(mediaConnection);
    }

    const setEventLister = mediaConnection => {
        mediaConnection.on('stream', stream => {
            const videoElement = document.getElementById('their-video')
            videoElement.srcObject = stream;
            videoElement.play();
        })
    }

    //以下着信処理
    peer.on('call', mediaConnection => {
        mediaConnection.answer(localStream);
        setEventLister(mediaConnection);
    });
})();