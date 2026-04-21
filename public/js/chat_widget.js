// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import { getDatabase, push, ref, onValue } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA9t55L8-O5S6VD9ZYPF1lHbmWYMu_mb6k",
    authDomain: "sam-s-photography.firebaseapp.com",
    databaseURL: "https://sam-s-photography-default-rtdb.firebaseio.com",
    projectId: "sam-s-photography",
    storageBucket: "sam-s-photography.firebasestorage.app",
    messagingSenderId: "543563819072",
    appId: "1:543563819072:web:3840062c60cd8560f5d7a5",
    measurementId: "G-BWWX687979"
    // apiKey: process.env.CHATMESSAGE_API,
    // authDomain: process.env.CHATMESSAGE_AUTH_DOMAIN,
    // databaseURL: process.env.CHATMESSAGE_DATABASE,
    // projectId: process.env.CHATMESSAGE_PROJECT_ID,
};

//   const firebaseConfig = {
//     apiKey: "AIzaSyA9t55L8-O5S6VD9ZYPF1lHbmWYMu_mb6k",
//     authDomain: "sam-s-photography.firebaseapp.com",
//     databaseURL: "https://sam-s-photography-default-rtdb.firebaseio.com",
//     projectId: "sam-s-photography",
//     storageBucket: "sam-s-photography.firebasestorage.app",
//     messagingSenderId: "543563819072",
//     appId: "1:543563819072:web:3840062c60cd8560f5d7a5",
//     measurementId: "G-BWWX687979"
//   };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


document.addEventListener("DOMContentLoaded", () => {


    const chatLauncher = document.getElementById("chatLauncher")
    const chatPanel = document.getElementById("chatPanel")
    const chatClose = document.getElementById("chatClose")
    const chatStartButton = document.getElementById("chatStartButton")
    const chatComposeForm = document.getElementById("chatComposeForm")
    const chatMessageInput = document.getElementById("chatMessageInput")
    const chatMessageArea = document.getElementById("chatMessageArea")
    const chatComposeFormButton = document.getElementById("chatComposeFormButton")

    let chatID = null


    // chat-box open 
    chatLauncher.addEventListener("click", async () => {
        const isOpen = chatPanel.classList.toggle("open");
        chatPanel.setAttribute("aria-hidden", String(!isOpen));
    });

    // chat-box close
    chatClose.addEventListener("click", () => {
        chatPanel.classList.remove("open");
        chatPanel.setAttribute("aria-hidden", "true");
    });

    //start Chat
    chatStartButton.addEventListener("click", async () => {
        const name = document.getElementById("chatGuestName").value.trim()
        const email = document.getElementById("chatGuestEmail").value.trim()
        const phone = document.getElementById("chatGuestPhone").value.trim()

        //validation
        if (!name || !email || !phone) {
            alert("Required all fields.")
            return
        }

        //save data into firebase database
        const chatRef = await push(ref(database, "userChats"), {
            name: name,
            email: email,
            phone: phone,
            createdAt: Date.now()
        })

        //store in chatid
        chatID = chatRef.key

        console.log("Chat Created with ID:", chatID);

        //save chatID in browser
        localStorage.setItem("chatID", chatID)

        //show chat section
        showChatStep()

        //listen chat-messages
        listenMessages()
    })


    //check on page load
    const savedChatID = localStorage.getItem('chatID')
    if (savedChatID) {
        chatID = savedChatID
        showChatStep()
        listenMessages(chatID)
    } else {
        // new user
        showDetailsStep()
    }

    //message send to firebase database
    chatComposeForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const text = chatMessageInput.value.trim()

        // console.log("Message:", text);
        // console.log("ChatID:", chatID);


        if (!text) {
            alert("message is Empty")
            return
        }
        if (!chatID) {
            alert("Chat not initialized properly")
            return
        }

        try {

            await push(ref(database, `userChats/${chatID}/messages`), {
                text: text,
                sender: "user",
                createdAt: Date.now()
            })

            // console.log("Message Sent Successfully");

            chatMessageInput.value = ""
        } catch (err) {
            console.error("Firebase Error:", err);

        }
    })

    //enter send message
    chatMessageInput.addEventListener("keydown", (event)=>{
        //enter press without shift
        if(event.key === "Enter" && !event.shiftKey){
            event.preventDefault()
            chatComposeForm.requestSubmit()
        }
    })


    //listen message funcation in realtime
    function listenMessages(chatID) {

        console.log('Listenning Message is running', chatID);

        const MessagesRef = ref(database, `userChats/${chatID}/messages`)

        onValue(MessagesRef, (snapshot) => {
            console.log("snapshot:", snapshot.val());

            const data = snapshot.val() || {}

            chatMessageArea.innerHTML = ""

            if (Object.keys(data).length === 0) {
                chatMessageArea.innerHTML = `<div class="chat-empty-state">
                    <strong>Start a conversation</strong>
                    <p>Ask about bookings, availability, portfolios, or anything else.</p>
                </div>`
                return
            }

            Object.values(data)
                    .sort((a, b) => a.createdAt - b.createdAt)
                    .forEach(msg => {
                        appendMessage(msg)
                    })
        })
    }


    //show message in UI
    function appendMessage(msg) {
        const div = document.createElement("div")

        div.classList.add('chat-bubble', msg.sender)

        div.innerHTML = `
        <div>${msg.text}</div>`

        chatMessageArea.appendChild(div)
        chatMessageArea.scrollTop = chatMessageArea.scrollHeight

    }

    //create helper funcation
    function showChatStep() {
        //move to chat screen
        document.getElementById("chatDetailsStep").hidden = true
        document.getElementById('chatMessagesStep').hidden = false
    }

    function showDetailsStep() {
        //move to Detail form screen
        document.getElementById("chatDetailsStep").hidden = false
        document.getElementById('chatMessagesStep').hidden = true
    }




})






// document.addEventListener("DOMContentLoaded", () => {
//     const widget = document.getElementById("chatWidget");
//     if (!widget) return;

//     const launcher = document.getElementById("chatLauncher");
//     const launcherPing = document.getElementById("chatLauncherPing");
//     const panel = document.getElementById("chatPanel");
//     const closeButton = document.getElementById("chatClose");
//     const identityForm = document.getElementById("chatIdentityForm");
//     const startButton = document.getElementById("chatStartButton");
//     const detailsStep = document.getElementById("chatDetailsStep");
//     const messagesStep = document.getElementById("chatMessagesStep");
//     const messageArea = document.getElementById("chatMessageArea");
//     const composeForm = document.getElementById("chatComposeForm");
//     const messageInput = document.getElementById("chatMessageInput");
//     const feedback = document.getElementById("chatFeedback");
//     const typingIndicator = document.getElementById("chatTypingIndicator");
//     const adminStatus = document.getElementById("chatAdminStatus");
//     const adminDot = document.getElementById("chatAdminDot");
//     const nameInput = document.getElementById("chatGuestName");
//     const emailInput = document.getElementById("chatGuestEmail");
//     const phoneInput = document.getElementById("chatGuestPhone");


//     const showMessagesStep = () => {
//         detailsStep.hidden = true;
//         messagesStep.hidden = false;
//     };

//     const showDetailsStep = () => {
//         detailsStep.hidden = false;
//         messagesStep.hidden = true;
//     };

//     const setAdminPresence = (isOnline) => {
//         adminStatus.textContent = isOnline ? "Admin is online now" : "Admin is offline right now";
//         adminDot.classList.toggle("online", Boolean(isOnline));
//         adminDot.classList.toggle("offline", !Boolean(isOnline));
//     };

//     const persistIdentity = () => {
//         localStorage.setItem(storageKey, JSON.stringify({
//             guestToken: state.guestToken,
//             guestName: nameInput.value.trim(),
//             guestEmail: emailInput.value.trim(),
//             guestPhone: phoneInput.value.trim()
//         }));
//     };

//     const renderMessages = (messages = []) => {
//         if (!messages.length) {
//             messageArea.innerHTML = `
//                 <div class="chat-empty-state">
//                     <strong>Start a conversation</strong>
//                     <p>Ask about bookings, availability, portfolios, or anything else.</p>
//                 </div>
//             `;
//             return;
//         }

//         messageArea.innerHTML = messages.map((message) => `
//             <article class="chat-bubble ${message.senderType === "admin" ? "admin" : "user"}">
//                 <span class="chat-bubble-author">${escapeHtml(message.senderName)}</span>
//                 <p>${escapeHtml(message.body)}</p>
//                 <time>${new Date(message.createdAt).toLocaleString()}</time>
//             </article>
//         `).join("");

//         messageArea.scrollTop = messageArea.scrollHeight;
//     };

//     const syncConversation = async () => {
//         const response = await fetch("/api/chat/conversations/init", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 guestToken: state.guestToken,
//                 guestName: nameInput.value.trim(),
//                 guestEmail: emailInput.value.trim(),
//                 guestPhone: phoneInput.value.trim(),
//                 guestPage: window.location.pathname
//             })
//         });

//         if (!response.ok) {
//             throw new Error("Unable to start chat.");
//         }

//         const data = await response.json();
//         state.guestToken = data.guestToken;
//         state.conversationId = data.conversation.id;
//         persistIdentity();
//         showMessagesStep();
//         renderMessages(data.conversation.messages);
//         setAdminPresence(data.conversation.isAdminOnline);

//         if (state.connectedGuestToken !== state.guestToken) {
//             socket.emit("chat:user-connect", {
//                 guestToken: state.guestToken,
//                 guestName: nameInput.value.trim(),
//                 guestEmail: emailInput.value.trim(),
//                 guestPhone: phoneInput.value.trim(),
//                 guestPage: window.location.pathname
//             });
//             state.connectedGuestToken = state.guestToken;
//         }

//         if (data.conversation.unreadUserCount > 0) {
//             await markAsRead();
//         }
//     };

//     const refreshConversation = async () => {
//         if (!state.guestToken) return;

//         const response = await fetch(`/api/chat/conversations/${encodeURIComponent(state.guestToken)}/messages`);
//         if (!response.ok) return;

//         const data = await response.json();
//         state.conversationId = data.conversation.id;
//         showMessagesStep();
//         renderMessages(data.conversation.messages);
//         setAdminPresence(data.conversation.isAdminOnline);
//     };

//     const markAsRead = async () => {
//         if (!state.guestToken || !state.conversationId) return;

//         await fetch(`/api/chat/conversations/${encodeURIComponent(state.guestToken)}/read`, {
//             method: "POST"
//         });

//         socket.emit("chat:mark-read", {
//             conversationId: state.conversationId,
//             readerType: "user"
//         });

//         launcherPing.hidden = true;
//     };

//     launcher.addEventListener("click", async () => {
//         const isOpen = panel.classList.toggle("open");
//         panel.setAttribute("aria-hidden", String(!isOpen));
//         if (isOpen) {
//             if (state.guestToken && (nameInput.value.trim() && (emailInput.value.trim() || phoneInput.value.trim()))) {
//                 await syncConversation();
//                 await markAsRead();
//                 messageInput.focus();
//             } else {
//                 showDetailsStep();
//                 nameInput.focus();
//             }
//         }
//     });

//     closeButton.addEventListener("click", () => {
//         panel.classList.remove("open");
//         panel.setAttribute("aria-hidden", "true");
//     });

//     identityForm.addEventListener("change", persistIdentity);
//     identityForm.addEventListener("input", persistIdentity);

//     startButton.addEventListener("click", async () => {
//         const guestName = nameInput.value.trim();
//         const guestEmail = emailInput.value.trim();
//         const guestPhone = phoneInput.value.trim();

//         if (!guestName) {
//             setFeedback("Please enter your name before opening chat.", "error");
//             nameInput.focus();
//             return;
//         }

//         if (!guestEmail && !guestPhone) {
//             setFeedback("Please add your email or phone number so admin can identify you.", "error");
//             emailInput.focus();
//             return;
//         }

//         try {
//             await syncConversation();
//             await markAsRead();
//             setFeedback("Details saved. You can start chatting now.", "success");
//             messageInput.focus();
//         } catch (error) {
//             setFeedback("We could not open the chat right now. Please try again.", "error");
//         }
//     });

//     composeForm.addEventListener("submit", async (event) => {
//         event.preventDefault();

//         const guestName = nameInput.value.trim();
//         const guestEmail = emailInput.value.trim();
//         const guestPhone = phoneInput.value.trim();
//         const body = messageInput.value.trim();

//         if (!guestName) {
//             setFeedback("Please add your name before sending a message.", "error");
//             nameInput.focus();
//             return;
//         }

//         if (!guestEmail && !guestPhone) {
//             setFeedback("Please add your email or phone number before sending a message.", "error");
//             showDetailsStep();
//             emailInput.focus();
//             return;
//         }

//         if (!body) return;

//         try {
//             if (!state.conversationId) {
//                 await syncConversation();
//             }

//             socket.emit("chat:send-message", {
//                 conversationId: state.conversationId,
//                 senderType: "user",
//                 senderName: guestName,
//                 body
//             });

//             messageInput.value = "";
//             setFeedback("Message sent. Admin can reply here.", "success");
//             socket.emit("chat:typing", {
//                 conversationId: state.conversationId,
//                 senderType: "user",
//                 isTyping: false
//             });
//         } catch (error) {
//             setFeedback("We could not send your message. Please try again.", "error");
//         }
//     });

//     messageInput.addEventListener("input", async () => {
//         if (!state.conversationId) {
//             try {
//                 await syncConversation();
//             } catch (error) {
//                 return;
//             }
//         }

//         socket.emit("chat:typing", {
//             conversationId: state.conversationId,
//             senderType: "user",
//             isTyping: true
//         });

//         clearTimeout(state.typingTimeout);
//         state.typingTimeout = setTimeout(() => {
//             socket.emit("chat:typing", {
//                 conversationId: state.conversationId,
//                 senderType: "user",
//                 isTyping: false
//             });
//         }, 900);
//     });

//     socket.on("chat:connected", (payload) => {
//         state.conversationId = payload.conversationId;
//         state.guestToken = payload.guestToken;
//         state.connectedGuestToken = payload.guestToken;
//         persistIdentity();
//         setAdminPresence(payload.adminOnline);
//     });

//     socket.on("chat:new-message", ({ conversationId, message }) => {
//         if (Number(conversationId) !== Number(state.conversationId)) return;
//         refreshConversation();

//         if (message.senderType === "admin" && !panel.classList.contains("open")) {
//             launcherPing.hidden = false;
//         }
//     });

//     socket.on("chat:presence", ({ conversationId, adminOnline }) => {
//         if (Number(conversationId) !== Number(state.conversationId)) return;
//         setAdminPresence(adminOnline);
//     });

//     socket.on("chat:typing", ({ conversationId, senderType, isTyping }) => {
//         if (Number(conversationId) !== Number(state.conversationId) || senderType !== "admin") return;
//         typingIndicator.hidden = !isTyping;
//     });

//     socket.on("chat:read-updated", ({ conversationId }) => {
//         if (Number(conversationId) === Number(state.conversationId)) {
//             launcherPing.hidden = true;
//         }
//     });

//     socket.on("chat:error", ({ message }) => {
//         if (message) {
//             setFeedback(message, "error");
//         }
//     });

//     if (state.guestToken) {
//         if (nameInput.value.trim() && (emailInput.value.trim() || phoneInput.value.trim())) {
//             syncConversation().catch(() => refreshConversation());
//         } else {
//             showDetailsStep();
//             setAdminPresence(false);
//         }
//     } else {
//         showDetailsStep();
//         setAdminPresence(false);
//     }
// });
