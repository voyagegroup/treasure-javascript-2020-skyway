var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Peer from "skyway-js";
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var localStream, videoElement, error_1, peer, MyID, OpponentID, connectButton, messages, sendButton, closeButton, inputText, setEventListener;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true, video: true })];
                case 1:
                    localStream = _a.sent();
                    videoElement = document.getElementById('my-video');
                    videoElement.srcObject = localStream;
                    videoElement.play();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    alert(error_1);
                    return [3 /*break*/, 3];
                case 3:
                    peer = new Peer({
                        key: 'ea80ddcc-69d3-4f03-a981-75bb74a3f4bb',
                        debug: 3
                    });
                    MyID = document.getElementById('my-id');
                    OpponentID = document.getElementById('their-id');
                    connectButton = document.getElementById('js-connect-trigger');
                    messages = document.getElementById('js-messages');
                    sendButton = document.getElementById('js-send-trigger');
                    closeButton = document.getElementById('js-close-trigger');
                    inputText = document.getElementById('js-local-text');
                    //PeerID取得
                    peer.on('open', function () {
                        MyID.textContent = peer.id;
                    });
                    // 発信処理
                    connectButton.onclick = function () {
                        if (!peer.open) {
                            return;
                        }
                        var theirID = OpponentID.value;
                        //ビデオ通話の開始
                        var mediaConnection = peer.call(theirID, localStream);
                        //チャットの開始
                        var dataConnection = peer.connect(theirID);
                        dataConnection.once('open', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                messages.innerHTML += "=== DataConnection has been opened ===\n";
                                sendButton.addEventListener('click', onClickSend);
                                return [2 /*return*/];
                            });
                        }); });
                        dataConnection.on('data', function (data) {
                            messages.textContent += "Remote: " + data + "\n";
                        });
                        dataConnection.once('close', function () {
                            messages.textContent += "=== DataConnection has been closed ===\n";
                            sendButton.removeEventListener('click', onClickSend);
                        });
                        // Register closing handler
                        closeButton.addEventListener('click', function () {
                            dataConnection.close(), {
                                once: true,
                            }, mediaConnection.close(true);
                        });
                        function onClickSend() {
                            var data = inputText.value;
                            dataConnection.send(data);
                            messages.textContent += "You: " + data + "\n";
                            messages.value = '';
                            console.log('clicked');
                        }
                        setEventListener(mediaConnection);
                    };
                    //着信処理
                    peer.on('call', function (mediaConnection) {
                        mediaConnection.answer(localStream);
                        setEventListener(mediaConnection);
                    });
                    // Register connected peer handler
                    peer.on('connection', function (dataConnection) {
                        dataConnection.once('open', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                messages.innerHTML += "=== DataConnection has been opened ===\n";
                                sendButton.addEventListener('click', onClickSend);
                                return [2 /*return*/];
                            });
                        }); });
                        dataConnection.on('data', function (data) {
                            messages.innerHTML += "Remote: " + data + "\n";
                        });
                        dataConnection.once('close', function () {
                            messages.innerHTML += "=== DataConnection has been closed ===\n";
                            sendButton.removeEventListener('click', onClickSend);
                        });
                        // Register closing handler
                        closeButton.addEventListener('click', function () {
                            dataConnection.close(), {
                                once: true,
                            }, dataConnection.close(true);
                        });
                        function onClickSend() {
                            var data = inputText.value;
                            dataConnection.send(data);
                            messages.innerHTML += "You: " + data + "\n";
                            messages.value = '';
                        }
                    });
                    setEventListener = function (mediaConnection) {
                        mediaConnection.on('stream', function (stream) {
                            // video要素にカメラ映像をセットして再生
                            var videoElm = document.getElementById('their-video');
                            videoElm.srcObject = stream;
                            videoElm.play();
                        });
                    };
                    return [2 /*return*/];
            }
        });
    });
})();
