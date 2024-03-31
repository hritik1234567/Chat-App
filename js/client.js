
const socket = io("http://localhost:80");


const form=document.getElementById('send-container');
const messageinput=document.getElementById('messageinp');
const messagecontainer=document.querySelector(".container");
const exiting=document.getElementById('exit');
var audio=new Audio('tone.mp3');


const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messagecontainer.append(messageElement);
    audio.play();
    messagecontainer.scrollTop = messagecontainer.scrollHeight;
}

var user=prompt("Enter your name to join");

    // Emit the 'new-user-joined' event when the client connects
    socket.emit('user-joined', user);


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageinput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageinput.value='';
});


  socket.on('user-joined',user=>{
    append(`${user} joined the chat`,'right');
  });


 socket.on('recieve',data=>{
    append(`${data.user}:${data.messages}`,'left'); 
 });
exiting.addEventListener('click', function() {
  // Close the current window
  
  window.location.href='';
});
 socket.on('left',user=>{
  append(`${user} left the chat`,'left');
});