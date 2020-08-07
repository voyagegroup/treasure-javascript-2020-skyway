var Peer = require("skyway-js");

(async function(){
    let localStream: MediaStream;
    try{
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const videoElement: HTMLVideoElement = <HTMLVideoElement>document.getElementById('my-video');
        videoElement.srcObject = localStream;
        videoElement.play();
    } catch(error) {
        alert(error);
    }

    //Peer作成
    const peer = new Peer({
        key: 'ea80ddcc-69d3-4f03-a981-75bb74a3f4bb',
        debug: 3
    });

    const MyID: HTMLElement = <HTMLElement>document.getElementById('my-id');
    const OpponentID: HTMLInputElement = <HTMLInputElement>document.getElementById('their-id');
    const connectButton: HTMLElement = <HTMLElement>document.getElementById('js-connect-trigger');
    let messages: HTMLInputElement = <HTMLInputElement>document.getElementById('js-messages');
    const sendButton: HTMLElement = <HTMLElement>document.getElementById('js-send-trigger');
    const closeButton: HTMLElement = <HTMLElement>document.getElementById('js-close-trigger');
    let inputText: HTMLInputElement = <HTMLInputElement>document.getElementById('js-local-text');
    //PeerID取得
    peer.on('open', () => {
        MyID.textContent = peer.id;
    });

    // 発信処理
    connectButton.onclick = () => {
        if (!peer.open) {
            return;
        }
        
        const theirID = OpponentID.value;
        //ビデオ通話の開始
        let mediaConnection = peer.call(theirID, localStream);
        //チャットの開始
        const dataConnection = peer.connect(theirID);
        dataConnection.once('open', async () => {
            messages.innerHTML += `=== DataConnection has been opened ===\n`;
            sendButton.addEventListener('click', onClickSend);
        });
        
        dataConnection.on('data', (data: string) => {
            messages.textContent += `Remote: ${data}\n`;
        });
    
        dataConnection.once('close', () => {
            messages.textContent += `=== DataConnection has been closed ===\n`;
            sendButton.removeEventListener('click', onClickSend);
        });
    
        // Register closing handler
        closeButton.addEventListener('click', () => {dataConnection.close(), {
            once: true,
        }, mediaConnection.close(true)});
    
        function onClickSend() {
            const data = inputText.value;
            dataConnection.send(data);
        
            messages.textContent += `You: ${data}\n`;
            messages.value = '';
            console.log('clicked');
        }


        setEventListener(mediaConnection);
    };

    //着信処理
    peer.on('call', (mediaConnection: any) => {
        mediaConnection.answer(localStream);
        setEventListener(mediaConnection);
    });

    // Register connected peer handler
    peer.on('connection', (dataConnection: any) => {
        dataConnection.once('open', async () => {
        messages.innerHTML += `=== DataConnection has been opened ===\n`;
        sendButton.addEventListener('click', onClickSend);
        });

        dataConnection.on('data', (data: string) => {
        messages.innerHTML += `Remote: ${data}\n`;
        });

        dataConnection.once('close', () => {
        messages.innerHTML += `=== DataConnection has been closed ===\n`;
        sendButton.removeEventListener('click', onClickSend);
        });

        // Register closing handler
        closeButton.addEventListener('click', () => {dataConnection.close(), {
        once: true,
        }, dataConnection.close(true)});

        function onClickSend() {
        const data = inputText.value;
        dataConnection.send(data);

        messages.innerHTML += `You: ${data}\n`;
        messages.value = '';
        }
    });
    
    // イベントリスナを設置する関数
    const setEventListener = (mediaConnection: any) => {
        mediaConnection.on('stream', (stream: any) => {
        // video要素にカメラ映像をセットして再生
        const videoElm: HTMLMediaElement = <HTMLMediaElement>document.getElementById('their-video')
        videoElm.srcObject = stream;
        videoElm.play();
        });
    }

})();