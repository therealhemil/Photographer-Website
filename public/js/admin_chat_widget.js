// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import { getDatabase, push, ref, onValue, off } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

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
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


document.addEventListener("DOMContentLoaded", () => {


  const chatList = document.getElementById("chatConversationList")
  const chatMessages = document.getElementById("chatAdminMessages")
  const chatHeader = document.getElementById("chatAdminPanelHead")

  const chatForm = document.getElementById("chatAdminCompose")
  const chatInput = document.getElementById("chatAdminInput")
  const sendBtn = document.getElementById("chatAdminSendButton")

  let selectedChatId = null
  let currentListener = null


  //load user conversion side
  onValue(ref(database, "userChats"), (snapshot) => {

    console.log("Snapshot:", snapshot.val())

    const data = snapshot.val() || {}

    chatList.innerHTML = ""

    Object.entries(data).forEach(([chatId, chat]) => {
      const div = document.createElement("div")
      div.classList.add("chat-row")
      div.innerHTML = `
      <strong>User Name: ${chat.name}</strong>
      <p>User EmailID: ${chat.email || ""}</p>`

      div.onclick = () => selectChat(chatId, chat)

      chatList.appendChild(div)

    })
  })


  //create selectChat function
  function selectChat(chatId, chatData) {
    selectedChatId = chatId

    //enable input
    chatInput.disabled = false
    sendBtn.disabled = false


    // update header
    chatHeader.innerHTML = `
        <div>
            <h2>User Name: ${chatData.name}</h2>
            <p>User EmailID: ${chatData.email || ""}</p>
        </div>
    `
    loadMessages(chatId)

  }


  //create load function
  function loadMessages(chatId) {

    // //remove old listener
    if (currentListener) {
      off(currentListener)
    }

    const messagesRef = ref(database, `userChats/${chatId}/messages`)
    currentListener = messagesRef

    onValue(messagesRef, (snapshot) => {

      const data = snapshot.val() || {}

      chatMessages.innerHTML = ""

      if (Object.keys(data).length === 0) {
        chatMessages.innerHTML = `
                <div class="chat-admin-empty">
                    <strong>No messages yet</strong>
                </div>
            `
        return
      }

      Object.values(data)
        .sort((a, b) => a.createdAt - b.createdAt)
        .forEach(msg => {

          const div = document.createElement("div")

          div.classList.add("chat-bubble", msg.sender)

          div.innerHTML = `
          <div id="chatSpacer">${msg.text}</div>`

          chatMessages.appendChild(div)
        })

      chatMessages.scrollTop = chatMessages.scrollHeight
    })
  }


  //send admin reply
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const text = chatInput.value.trim()

    if (!text || !selectedChatId) return

    await push(ref(database, `userChats/${selectedChatId}/messages`), {
      text: text,
      sender: "admin",
      createdAt: Date.now()
    })

    chatInput.value = ""
  })


  // send message using Enter
  chatInput.addEventListener("keydown", (e)=>{
    if(e.key === "Enter" && !e.shiftKey){
      e.preventDefault()
      chatForm.requestSubmit()
    }
  })




})