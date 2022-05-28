let peerConnection;
let localStream;
let remoteStream;

const services = {
  iceService: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    }
  ]
}

const init = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

  document.getElementById('user-1').srcObject = localStream;
}

const createOffer = async () => {
  peerConnection = new RTCPeerConnection(services);
  remoteStream = new MediaStream();

  document.getElementById('user-2').srcObject = remoteStream;

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = async (event) => {
    event.streams[0].getTracks().forEach(track => {
      remoteStream.addTrack(track);
    });
  }

  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription)
    }
  }

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);


  document.getElementById('offer-sdp').value = JSON.stringify(offer)
}

const createAnswer = async () => {
  peerConnection = new RTCPeerConnection(services);
  remoteStream = new MediaStream();

  document.getElementById('user-2').srcObject = remoteStream;

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = async (event) => {
    event.streams[0].getTracks().forEach(track => {
      remoteStream.addTrack(track);
    });
  }

  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription)
    }
  }

  let offer = document.getElementById('offer-sdp').value;
  if (!offer) return alert('Please enter offer sdp');

  offer = JSON.parse(offer);
  await peerConnection.setRemoteDescription(offer);

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  document.getElementById('answer-sdp').value = JSON.stringify(answer)
}

const addAnswer = () => {
  let answer = document.getElementById('answer-sdp').value
  if (!answer) return alert('Please enter answer sdp');

  answer = JSON.parse(answer);

  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer);
  }
}
init()

document.getElementById('create-offer').addEventListener('click', createOffer)
document.getElementById('create-answer').addEventListener('click', createAnswer)
document.getElementById('add-answer').addEventListener('click', addAnswer)
