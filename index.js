(async function(){
    console.log("hello treasure");
    let localStream;
    const localText = document.getElementById('js-local-text');
    const messages = document.getElementById('js-messages');
    const sendTrigger = document.getElementById('js-send-trigger');
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
        const dataConnection = peer.connect(theirID);
        setEventListener(mediaConnection);

        dataConnection.once('open', async () => {
            messages.textContent += `=== DataConnection has been opened === \n`;
            sendTrigger.addEventListener('click', onClickSend);
        });

        dataConnection.on('data', data => {
            messages.textContent += `Remote: ${data}\n`;
        });

        function onClickSend() {
            const data = localText.value;
            dataConnection.send(data);
            messages.textContent += `You: ${data}\n`;
            localText.value = '';
        }
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

    peer.on('connection', dataConnection => {
        dataConnection.once('open', async() => {
            messages.textContent += `===DataConnection has been opened ===\n`;
            sendTrigger.addEventListener('click', onClickSend);
        });

        dataConnection.on('data', data => {
            messages.textContent += `Remote: ${data}\n`;
        });

        function onClickSend() {
            const data = localText.value;
            dataConnection.send(data);

            messages.textContent += `You: ${data}\n`;
            localText.value = '';
        }
    })

})();