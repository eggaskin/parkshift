
async function getMessage(inp) {
    var input = inp
    return fetch('http://127.0.0.1:5000/run-python-script', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ parameter: input }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        return data.result;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

var messageQueue = [];

async function sendMessage() {
    var userMessage = document.getElementById('userInput').value;
    console.log(userMessage);
    response = await getMessage(userMessage)
    console.log("response " + response);

    // clear input
    document.getElementById('userInput').value = '';
    
    //response => {
    var botMessage = 'Parking Buddy: ' + response;
    messageQueue.push(String("Me: "+userMessage), botMessage);
    if (messageQueue.length > 4) {
        messageQueue.shift();
    }
    displayMessages();
        
}

document.getElementById('sendMessage').addEventListener('click', sendMessage);

function displayMessages() {
    var chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    for (var i = 0; i < messageQueue.length; i++) {
        var message = document.createElement('div');
        message.textContent = messageQueue[i];
        chatContainer.appendChild(message);
    }
}
