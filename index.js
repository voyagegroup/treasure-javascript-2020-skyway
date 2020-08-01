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
    };

    const peer = new Peer({
        key: '84470966-1e1a-4e4a-9cb3-ece063641a67',
        debug: 3
    });

    peer.on('open', () => {
        document.getElementById('my-id').textContent = peer.id;
    });

    const setEventListener = mediaConnection => {
        mediaConnection.on('stream', stream => {
            const videoElm = document.getElementById('their-video');
            videoElm.srcObject = stream;
            videoElm.play();
        });
    };

    document.getElementById('make-call').onclick = () => {
        const thierID = document.getElementById('their-id').value;
        const mediaConnection = peer.call(thierID, localStream)
        setEventListener(mediaConnection)
    };

    peer.on('call', mediaConnection => {
        mediaConnection.answer(localStream);
        setEventListener(mediaConnection);
    }); 


})();

