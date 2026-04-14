document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("contactPage_updateForm").addEventListener("submit", async (e) => {
        e.preventDefault()


        const address = document.getElementById("address").value
        const phone_number = document.getElementById("phone_number").value
        const email = document.getElementById("email").value

        try {
            const res = await fetch('/admin/update-contact', {
                method : "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ address, phone_number, email })
            })

            const data = await res.json()
            
            const message = document.getElementById("message")

            if (data.type == "success") {
                message.style.color = "green"
                message.innerHTML = data.message

                setTimeout(() => {
                    location.reload()
                }, 2000)
            }else {
                message.style.color = "red"
                message.innerHTML = data.message
            }

        } catch(err){
            console.log(err);
            
        }


    })
})