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
        debug: 0
    })

    peer.on('open', () => {
        document.getElementById('my-id').textContent = peer.id
    })

    peer.on('call', mediaConnection => {
        mediaConnection.answer(localStream);
        setEventListener(mediaConnection);
    })

    peer.on('connection', dataConnection => {
        setEventListenerForData(dataConnection);
    })

    document.getElementById('make-call').onclick = () => {
        const theirID = document.getElementById('their-id').value;
        const mediaConnection = peer.call(theirID, localStream);
        const dataConnection = peer.connect(theirID);

        setEventListener(mediaConnection);
        setEventListenerForData(dataConnection);

        document.getElementById('send-message').onclick = () => {
            const text = document.getElementById('local-text').value;
            dataConnection.send(text);
      
            document.getElementById('messages').textContent.textContent += `You: ${text}\n`;
            document.getElementById('local-text').value = '';
        }

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

    const setEventListenerForData = dataConnection => {
        dataConnection.on('open', async () => {
            console.log('open')
            document.getElementById('messages').textContent += "open\n";
        });
        dataConnection.on('data', data => {
            console.log(data)
            document.getElementById('messages').textContent += `Remote: ${data}\n`;
        });
        dataConnection.on('error', err => {
            console.log(err)
        })
    }
})();
