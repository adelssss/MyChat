document.addEventListener('DOMContentLoaded', () => { 
    const messageInput = document.getElementById('message-input');
    const messagesDiv = document.getElementById('messages');
    const chatForm = document.getElementById('chat-form');
    const usernameInput = document.getElementById('username-input'); 
    const eventSource = new EventSource('/sse'); 

    eventSource.onmessage = (event) => {
        const newMessage = document.createElement('div');
        newMessage.textContent = event.data;
        messagesDiv.appendChild(newMessage);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; 
    };
    
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value;
        const username = usernameInput.value; 

        const formattedMessage = `${username}: ${message}`;

        fetch(`/chat?message=${encodeURIComponent(formattedMessage)}`)
            .then(response => {
                if (response.ok) {
                    messageInput.value = ''; 
                } else {
                    console.error('Error sending message');
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
