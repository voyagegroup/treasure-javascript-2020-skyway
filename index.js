(async function(){
    console.log("hello treasure");


    let localStream;

    try {
        localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        const videoElement = document.getElementById('my-video');
        videoElement.srcObject = localStream;
        videoElement.play();
    } catch (error) {
        alert(error)
    }

    const peer = new Peer({
        key: "17f87a7c-2f92-4747-b274-d65882a0ebdb",
        debug: 3
    })

    peer.on('open', () => {
        document.getElementById('my-id').textContent = peer.id
    })

    peer.on('call', mediaConnection => {
        mediaConnection.answer(localStream);
        setEventListener(mediaConnection);
    })

    document.getElementById('make-call').onclick = () => {
        const theirID = document.getElementById('their-id').value;
        const mediaConnection = peer.call(theirID, localStream);
        setEventListener(mediaConnection);

        document.getElementById('close-call').onclick = () => {
            mediaConnection.close(true);
        }
    }


    const setEventListener = mediaConnection => {
        mediaConnection.on('stream', stream => {
            const videoElement = document.getElementById('their-video');
            videoElement.srcObject = stream;
            videoElement.play();
        })
    }
})();
