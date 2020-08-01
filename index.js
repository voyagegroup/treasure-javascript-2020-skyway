(async function(){
    console.log("hello treasure");
    let localStream;
    try {
        localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        const videoElement = document.getElementById('my-video');
        videoElement.srcObject = localStream;
        videoElement.play();
    } catch(error) {
        alert(error);
    }

    const peer = new Peer({
        key: '5c7b07d3-5053-4cbf-a699-cb4caed4e344',
        debug: 3
    });

    peer.on('open', () => {
        document.getElementById('my-id').textContent = peer.id;
    });

    document.getElementById('make-call').onclick = () => {
        const theirID = document.getElementById('their-id').value;
        const mediaConnection = peer.call(theirID, localStream);
        setEventListener(mediaConnection);
    };

    const setEventListener = mediaConnection => {
        mediaConnection.on('stream', stream => {
            const videoElm = document.getElementById('their-video');
            videoElm.srcObject = stream;
            videoElm.play();
        });
    }

    peer.on('call', mediaConnection => {
        mediaConnection.answer(localStream);
        setEventListener(mediaConnection);
    });

})();