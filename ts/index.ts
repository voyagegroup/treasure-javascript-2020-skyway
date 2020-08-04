// (async function(){
//     let localStream;
//     try{
//         localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//         const videoElement = document.getElementById('my-video');
//         videoElement.srcObject = localStream;
//         videoElement.play();
//     } catch(error) {
//         alert(error);
//     }

//     //Peer作成
//     const peer = new Peer({
//         key: 'ea80ddcc-69d3-4f03-a981-75bb74a3f4bb',
//         debug: 3
//     });

//     //PeerID取得
//     peer.on('open', () => {
//         document.getElementById('my-id').textContent = peer.id;
//     });

//     // 発信処理
//     document.getElementById('js-connect-trigger').onclick = () => {
//         if (!peer.open) {
//             return;
//         }
        
//         const theirID = document.getElementById('their-id').value;
//         //ビデオ通話の開始
//         const mediaConnection = peer.call(theirID, localStream);
//         //チャットの開始
//         const dataConnection = peer.connect(theirID);
//         dataConnection.once('open', async () => {
//             document.getElementById('js-messages').innerHTML += `=== DataConnection has been opened ===\n`;
//             document.getElementById('js-send-trigger').addEventListener('click', onClickSend);
//         });
        
//         dataConnection.on('data', data => {
//             document.getElementById('js-messages').textContent += `Remote: ${data}\n`;
//         });
    
//         dataConnection.once('close', () => {
//             document.getElementById('js-messages').textContent += `=== DataConnection has been closed ===\n`;
//             document.getElementById('js-send-trigger').removeEventListener('click', onClickSend);
//         });
    
//         // Register closing handler
//         document.getElementById('js-close-trigger').addEventListener('click', () => {dataConnection.close(), {
//             once: true,
//         }, mediaConnection.close(true)});
    
//         function onClickSend() {
//             const data = document.getElementById('js-local-text').value;
//             dataConnection.send(data);
        
//             document.getElementById('js-messages').textContent += `You: ${data}\n`;
//             document.getElementById('js-messages').value = '';
//             console.log('clicked');
//         }


//         setEventListener(mediaConnection);
//     };

//     //着信処理
//     peer.on('call', mediaConnection => {
//         mediaConnection.answer(localStream);
//         setEventListener(mediaConnection);
//     });

//     // Register connected peer handler
//     peer.on('connection', dataConnection => {
//         dataConnection.once('open', async () => {
//         document.getElementById('js-messages').innerHTML += `=== DataConnection has been opened ===\n`;
//         document.getElementById('js-send-trigger').addEventListener('click', onClickSend);
//         });

//         dataConnection.on('data', data => {
//         document.getElementById('js-messages').innerHTML += `Remote: ${data}\n`;
//         });

//         dataConnection.once('close', () => {
//         document.getElementById('js-messages').innerHTML += `=== DataConnection has been closed ===\n`;
//         document.getElementById('js-send-trigger').removeEventListener('click', onClickSend);
//         });

//         // Register closing handler
//         document.getElementById('js-close-trigger').addEventListener('click', () => {dataConnection.close(), {
//         once: true,
//         }, mediaConnection.close(true)});

//         function onClickSend() {
//         const data = document.getElementById('js-local-text').value;
//         dataConnection.send(data);

//         document.getElementById('js-messages').innerHTML += `You: ${data}\n`;
//         document.getElementById('js-messages').value = '';
//         }
//     });
    
//     // イベントリスナを設置する関数
//     const setEventListener = mediaConnection => {
//         mediaConnection.on('stream', stream => {
//         // video要素にカメラ映像をセットして再生
//         const videoElm = document.getElementById('their-video')
//         videoElm.srcObject = stream;
//         videoElm.play();
//         });
//     }

// })();

console.log('this is typeScript.');