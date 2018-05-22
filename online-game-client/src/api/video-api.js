import SocketActions from "./socket-actions";
import store from "../store";
import * as VideoChat from "../actions/video-actions";


class VideoApi {
    constructor(socket) {
        this.socket = socket;
        this.isInitiator = false;
        this.isStarted = false;
        this.offerMessage = undefined;
        this.localStream = undefined;
        this.pc = undefined;
        this.remoteStream = undefined;
        this.callUser = this.callUser.bind(this);
        this.getCallFromUser = this.getCallFromUser.bind(this);
        this.hangup = this.hangup.bind(this);
        this.createPeerConnection = this.createPeerConnection.bind(this);
        this.doAnswer = this.doAnswer.bind(this);
        this.doCall = this.doCall.bind(this);
        this.gotStream = this.gotStream.bind(this);
        this.maybeStart = this.maybeStart.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleIceCandidate = this.handleIceCandidate.bind(this);
        this.handleCreateOfferError = this.handleCreateOfferError.bind(this);
        this.setLocalAndSendMessage = this.setLocalAndSendMessage.bind(this);
        this.handleRemoteStreamAdded = this.handleRemoteStreamAdded.bind(this);
        this.handleRemoteStreamRemoved = this.handleRemoteStreamRemoved.bind(this);
        this.handleRemoteHangup = this.handleRemoteHangup.bind(this);
        this.stop = this.stop.bind(this);
        this.init = this.init.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.init();
    }

    init() {
        this.socket.on('message-video', this.handleMessage);
    }

    sendMessage(message) {
        this.socket.emit('message-video', message);
    }

    handleMessage(message) {
        if (message.type === 'offer') {
            this.offer = true;
            this.offerMessage = message;
            store.dispatch(
                VideoChat.getPhoneCall({offer: this.offer})
            );
        } else if (message.type === 'answer' && this.pc) {
            this.pc.setRemoteDescription(new RTCSessionDescription(message));
        } else if (message.type === 'candidate' && this.isStarted && this.pc) {
            let candidate = new RTCIceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate
            });
            this.pc.addIceCandidate(candidate);
        } else if (message.type === 'bye') {
            this.handleRemoteHangup();
        }
    }

    callUser() {
        this.isInitiator = true;
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
            .then(this.gotStream)
            .catch(function (e) {
                console.log('getUserMedia() error: ' + e.name);
            });
    }

    getCallFromUser() {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
            .then(this.gotStream)
            .then(this.maybeStart)
            .catch(function (e) {
                console.log('getUserMedia() error: ' + e.name);
            });

    }

    gotStream(stream) {
        this.localStream = stream;
        if (this.isInitiator) {
            this.maybeStart();
            store.dispatch(
                VideoChat.sendPhoneCall({
                    isInitiator: this.isInitiator,
                    isStarted: this.isStarted,
                    localStream: stream
                })
            );
        }
    }


    maybeStart() {
        if (!this.isStarted && typeof this.localStream !== 'undefined') {
            this.createPeerConnection();
            this.pc.addStream(this.localStream);
            this.isStarted = true;
            this.offer = false;

            if (this.isInitiator) {
                this.doCall();
            } else {
                this.doAnswer();
            }
        }
    }

    createPeerConnection() {
        try {
            this.pc = new RTCPeerConnection(null);
            this.pc.onicecandidate = this.handleIceCandidate;
            this.pc.onaddstream = this.handleRemoteStreamAdded;
            this.pc.onremovestream = this.handleRemoteStreamRemoved;
            if (this.offerMessage) {
                this.pc.setRemoteDescription(new RTCSessionDescription(this.offerMessage));
            }

        } catch (e) {
            //...
        }
    }

    handleIceCandidate(event) {
        if (event.candidate) {
            this.sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        }
    }

    handleCreateOfferError(event) {
        console.log('createOffer() error: ', event);
    }

    doCall() {
        this.pc.createOffer(this.setLocalAndSendMessage, this.handleCreateOfferError);
    }

    doAnswer() {
        this.pc.createAnswer().then(
            this.setLocalAndSendMessage
        );
    }

    setLocalAndSendMessage(sessionDescription) {
        this.pc.setLocalDescription(sessionDescription);
        this.sendMessage(sessionDescription);
    }


    handleRemoteStreamAdded(event) {
        this.remoteStream = event.stream;
        store.dispatch(
            VideoChat.startPhoneCall({
                isStarted: this.isStarted,
                offer: this.offer,
                localStream: this.localStream,
                remoteStream: this.remoteStream,
            })
        );
    }

    handleRemoteStreamRemoved(event) {
        this.handleRemoteHangup();
    }

    hangup() {
        this.stop();
        this.sendMessage({type: 'bye'});
    }

    handleRemoteHangup() {
        this.stop();
    }

    stop() {
        this.isStarted = false;
        this.offer = undefined;
        this.offerMessage = undefined;
        this.localStream = undefined;
        this.remoteStream = undefined;
        this.isInitiator = false;
        if (this.pc) {
            this.pc.close();
        }
        this.pc = null;
        store.dispatch(
            VideoChat.endPhoneCall({
                isStarted: this.isStarted,
                offer: this.offer,
                localStream: this.localStream,
                remoteStream: this.remoteStream,
                isInitiator: this.isInitiator,
            })
        );

    }

}

export default VideoApi;