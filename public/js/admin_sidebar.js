document.addEventListener('DOMContentLoaded', () => {
    //current url path
    // const currentPath = window.location.pathname

    // document.querySelectorAll(".menu li").forEach(link=>{
    //     const linkPath = link.getAttribute("href")

    //     if(currentPath === linkPath ||
    //         currentPath.startsWith(linkPath)
    //     ){
    //         link.parentElement.classList.add("active")
    //     }
    // })

    // links.forEach(link =>{
    //     if(link.href === window.location.href){
    //         link.parentElement.classList.add("active")
    //     }
    // })


    // logout admin
    document.querySelector('.admin_logout').addEventListener("click", async () => {
        await fetch("/logout", {
            method: "POST"
        })

        window.location.href = "/admin"
    })

    //admin redirect into dashbaord
    document.querySelector(".admin_dashboard").addEventListener("click", async () => {
        await fetch("/admin/dashboard", {
            method: "GET"
        })

        window.location.href = "/admin/dashboard"
    })


    //admin redirect into contactPage_Update
    document.querySelector(".WebsitePage_update").addEventListener("click", async () => {
        await fetch("/admin/contactPage_Update", {
            method: "GET"
        })

        window.location.href = "/admin/contactPage_Update"
    })


    // get redirect into Inquiry Table
    document.querySelector(".ContactMe_Form_dashbaord").addEventListener("click", async () => {
        await fetch("/admin/inquiry_Table", {
            method: "GET"
        })

        window.location.href = "/admin/inquiry_Table"
    })


    //get redirect into portfolio upload pages:
    document.getElementById("portfolioImgaesUpload").addEventListener("click", async () => {
        await fetch("/admin/uploadImage", {
            method: "GET"
        })
        window.location.href = "/admin/uploadImage"
    })

    //get redirect into chat_section page:
    document.getElementById("chatsection").addEventListener("click", async()=>{
        await fetch("/admin/chat-section", {
            method : "GET"
        })
        window.location.href = "/admin/chat-section"
    })


})