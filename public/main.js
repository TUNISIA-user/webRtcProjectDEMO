const socket = io();

// Listen for events
//socket.on('connect', () => {
     
  //  socket.on("hello",data=>{
   //     console.log(data)
   // })
//});



let peerConnection;
let localStream;
let remoteStream;

let displayMyScreen = async ()=>{
    localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:false})
    document.getElementById("user-1").srcObject = localStream

    
}


let createOffer  = async ()=>{
    peerConnection  = new RTCPeerConnection()
    // do  media stream for this user
    
    remoteStream  = new  MediaStream()  
    document.getElementById('user-2').srcObject = remoteStream



    localStream.getTracks().forEach(track => {
 
        peerConnection.addTrack(track,localStream)
    });


    peerConnection.ontrack = async (event)=>{
         
    event.streams[0].getTracks().forEach((tracks)=>{
        remoteStream.addTrack(tracks)
    })
    }

  
     peerConnection.onicecandidate = async (event)=>{
        if(event.candidate){

            
    
            socket.emit("offer",JSON.stringify(peerConnection.localDescription))
        }
     }

      

    let offer  = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
   

}

 
let createAnswer =async(data)=>{


    peerConnection  = new RTCPeerConnection()
    remoteStream  = new  MediaStream()  
    document.getElementById('user-2').srcObject = remoteStream



    localStream.getTracks().forEach(track => {
         
        peerConnection.addTrack(track,localStream) // so here you add my data in the peer connection 
    });


    peerConnection.ontrack = async (event)=>{
         
    event.streams[0].getTracks().forEach((tracks)=>{ // and here each one track give give his data and put it  in peer connection ??
        remoteStream.addTrack(tracks)
    })
    }

  
     peerConnection.onicecandidate = async ()=>{
         
            document.getElementById("answer-sdp").value  = JSON.stringify(peerConnection.localDescription)
            socket.emit("sendAnswer",JSON.stringify(peerConnection.localDescription))
        
        }
 
    offer  =JSON.parse(data)
    await   peerConnection.setRemoteDescription(offer)
    let answer  = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    
     

    //11111111111111111111111111111
 
   
}
 

displayMyScreen()  



 
 
document.getElementById("create-offer").addEventListener("click",createOffer)
document.getElementById("create-answer").addEventListener("click",createAnswer)
 
  

 



socket.on("getOffer",async(data)=>{
   // console.log(JSON.parse(data))
   await createAnswer(data)
  })



  socket.on("sendtheAnswer", async (data) => {
     
    let parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    
    peerConnection.setRemoteDescription(JSON.parse(JSON.stringify(parsedData,null,2)))
        
});




