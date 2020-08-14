(async function () {
    console.log("hello treasure");
    const joinTrigger = document.getElementById('js-join-trigger');
    const remoteStreams = document.getElementById('js-video-views');

    let localStream;
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true, audio: true,
        });
        const videoElement = document.getElementById('my-video');
        videoElement.srcObject = localStream;
        videoElement.play();
    } catch (error) {
        alert(error);
    }
    const peer = new Peer({
        key: '1014a9ca-bca3-4d69-b491-be84de574d81',
        debug: 3
    });


    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;


    joinTrigger.addEventListener('click', () => {
        if (!peer.open) {
            return;
        }

        const room = peer.joinRoom('roomId', {
            mode: 'treasure',
            stream: localStream,
        });


        room.on('stream', async stream => {
            const newButton = document.createElement('button');
            newButton.setAttribute('id', `their-video-button-${stream.peerId}`);
            newButton.setAttribute('class', "video__button");
            remoteStreams.append(newButton);
            const remoteVideos = document.getElementsByClassName('video__button');
            const remoteVideosLast = remoteVideos[remoteVideos.length - 1];

            const newVideo = document.createElement('video');
            const newComment = document.createElement('div');
            newVideo.srcObject = stream;
            newVideo.playsInline = true;
            newVideo.setAttribute('data-peer-id', stream.peerId);
            newVideo.setAttribute('class', "their__video");
            newVideo.setAttribute('id', stream.peerId);
            newComment.setAttribute('id', `${stream.peerId}-comment`);
            newComment.setAttribute('class', `their__comment`);
            remoteVideosLast.append(newVideo);
            remoteVideosLast.append(newComment);
            await newVideo.play().catch(console.error);


            const buttons = document.getElementsByClassName("video__button");
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener("click", (e) => {
                    console.log(e);
                    remoteStreams.insertBefore(e.target.parentElement, remoteStreams.firstChild);
                }, false);
            }
        });

        room.on('data', ({ data, src }) => {
            let peerView = document.getElementById(src);
            let peerComment = document.getElementById(`${src}-comment`);
            console.log(peerView)
            const newComment = document.createElement('p');
            newComment.setAttribute('class', "comment");
            newComment.textContent = `${src}: ${data}`;
            comments.insertBefore(newComment, comments.firstChild);
            if (peerView.id == src) {
                peerComment.textContent = ``
                peerComment.textContent = `${data}`
            }
        });


        const comments = document.getElementById('js-comments');

        recognition.start();
        let outputText = document.getElementById('my-output');
        recognition.onresult = (event) => {
            const comment = event.results[event.results.length - 1][0].transcript
            outputText.textContent = comment
            const newComment = document.createElement('p');
            newComment.setAttribute('class', "comment");
            newComment.textContent = `you: ${comment}`;
            comments.insertBefore(newComment, comments.firstChild);
            room.send(comment);
        }
    });

})();
