(async function(){

    const localId = document.getElementById('js-local-id');
    const localText = document.getElementById('js-local-text');
    const connectTrigger = document.getElementById('js-connect-trigger');
    const closeTrigger = document.getElementById('js-close-trigger');
    const sendTrigger = document.getElementById('js-send-trigger');
    const remoteId = document.getElementById('js-remote-id');
    const messages = document.getElementById('js-messages');
    const meta = document.getElementById('js-meta');
    const sdkSrc = document.querySelector('script[src*=skyway]');

    // peer id　の取得
    const peer = new Peer({
        key: 'f4314d6c-ad3c-450c-90df-2811611d4a25',
        debug: 3
      });

    peer.on('open', () => {
        document.getElementById('my-id').textContent = peer.id;
    });


    connectTrigger.addEventListener('click', () => {
        if (!peer.open) {
          return;
        }
        const dataConnection = peer.connect(remoteId.value);
    
        dataConnection.once('open', async () => {
          messages.textContent += `=== DataConnection has been opened ===\n`;
    
          sendTrigger.addEventListener('click', onClickSend);
        });
    
        dataConnection.on('data', data => {
          messages.textContent += `Remote: ${data}\n`;
        });
    
        dataConnection.once('close', () => {
          messages.textContent += `=== DataConnection has been closed ===\n`;
          sendTrigger.removeEventListener('click', onClickSend);
        });
    
        closeTrigger.addEventListener('click', () => dataConnection.close(), {
          once: true,
        });
    
        function onClickSend() {
          const data = localText.value;
          dataConnection.send(data);
    
          messages.textContent += `You: ${data}\n`;
          localText.value = '';
        }
      });
    
    //   peer.once('open', id => (localId.textContent = id));
    
    //   peer.on('connection', dataConnection => {
    //     dataConnection.once('open', async () => {
    //       messages.textContent += `=== DataConnection has been opened ===\n`;
    
    //       sendTrigger.addEventListener('click', onClickSend);
    //     });
    
    //     dataConnection.on('data', data => {
    //       messages.textContent += `Remote: ${data}\n`;
    //     });
    
    //     dataConnection.once('close', () => {
    //       messages.textContent += `=== DataConnection has been closed ===\n`;
    //       sendTrigger.removeEventListener('click', onClickSend);
    //     });
    
    //     closeTrigger.addEventListener('click', () => dataConnection.close(), {
    //       once: true,
    //     });
    
    //     function onClickSend() {
    //       const data = localText.value;
    //       dataConnection.send(data);
    
    //       messages.textContent += `You: ${data}\n`;
    //       localText.value = '';
    //     }
    //   });
    
      peer.on('error', console.error);
    })();