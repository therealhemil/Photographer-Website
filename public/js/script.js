window.onload = function () {
    let bannerImages = this.document.querySelector('.horizontal-images')
    let prevBtn = document.getElementById('prevBtn');
    let nextBtn = document.getElementById('nextBtn');

    console.log("Previous Button", prevBtn)
    console.log("Next button", nextBtn);
    if (bannerImages && prevBtn && nextBtn) {

        var scrollAmount = 280;
        prevBtn.addEventListener('click', () => {
            bannerImages.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
        })

        nextBtn.addEventListener('click', () => {
            bannerImages.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        })
    }
};


// Contact me form store in LocalStorage
// function submitForm(e) {
//     e.preventDefault();

//     // User Input
//     let user = {
//         name: document.getElementById("name").value,
//         email: document.getElementById("email").value,
//         phone: document.getElementById("phone").value,
//         Your_Message: document.getElementById("msg").value
//     }

//     // check if localstorage has data or []
//     let form_users = JSON.parse(localStorage.getItem("form_users")) || []
//     form_users.push(user)

//     // add user data into localstorage
//     localStorage.setItem("form_users", JSON.stringify(form_users))

//     // show Suceess message
//     document.getElementById("msg_here").innerHTML = "Form SuccessFully Submited"

//     //after submit reset form
//     document.querySelector("form").reset()
// }


// Full screen image // select elements
document.addEventListener("DOMContentLoaded", function () {

    const images = document.querySelectorAll(".img-box img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("closeBtn");

    // for each images
    images.forEach(img => {
        img.addEventListener("click", function () {
            lightbox.style.display = "flex";
            lightboxImg.src = img.src;
        });
    });


    // close full image
    closeBtn.addEventListener("click", function () {
        lightbox.style.display = "none";
    });

    lightbox.addEventListener("click", function (e) {
        if (e.target !== lightboxImg) {
            lightbox.style.display = "none";
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            lightbox.style.display = "none"
        }
    })

});


//contact-me form
document.addEventListener("DOMContentLoaded", () => {
    const contact_me_button = document.querySelector(".contact-me-button")
    contact_me_button.addEventListener("click", async (e) => {
        e.preventDefault()

        // const formData = {
        //     name: this.name.value,
        //     email: this.email.value,
        //     phone: this.phone.value,
        //     msg: this.msg.value
        // }

        const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            msg: e.target.msg.value
        }

        try {
            const res = await fetch("/contact-form", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            const message = document.querySelector(".contct-message")
            message.innerHTML = data.message
            message.style.color = data.type === "success" ? "green" : "red"
            this.reset()

            // reload after 2 sec if successfully submit
            setTimeout(() => {
                location.reload()
            }, 2000)

        } catch (err) {
            console.log(err);
        }
    })

    // hide message when user input
    const form = document.querySelector(".contact-me-form")

    form.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", () => {
            message.innerHTML = ""
        })
    })
})




// subscribe-email form
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".subscribe-email-form").addEventListener("submit", async function (e) {
        e.preventDefault()

        const email = this.email.value

        try {

            const res = await fetch("/subscribe-email", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email })
            })

            const data = await res.json()

            const msg = document.getElementById("sub-message")

            msg.innerHTML = data.message
            msg.style.color = data.type === "success" ? "green" : "red"

            this.reset()
        } catch (err) {
            console.log(err);

        }
    })

    // when user input message disapear
    document.querySelector(".subscribe-email-form").addEventListener("input", () => {
        document.getElementById("sub-message").innerHTML = "";
    })
})

// Admin-login page AJAX method
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".admin-login-form").addEventListener("submit", async function (e) {
        e.preventDefault()

        const admin_login_form = {
            email: this.email.value,
            password: this.password.value
        }

        try {
            // request server to get this data
            const res = await fetch("/admin-login-form", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify(admin_login_form)
            })

            // wait to server response
            const data = await res.json()

            const message = document.querySelector(".admin-login-message")

            message.innerHTML = data.message
            if (data.type === "success") {
                message.style.color = "green"

                // after 1sec redirect to dashboard page
                setTimeout(() => {
                    window.location.href = "/admin/dashboard"
                }, 1000)
            } else {
                message.style.color = "red"
            }
            // message.style.color = data.type === "success" ? "green" : "red"
        } catch (err) {
            console.log(err);

        }
    })

    // when user input message disapear
    document.querySelector(".admin-login-form").addEventListener("input", () => {
        document.querySelector(".admin-login-message").innerHTML = "";
    })
})


// login page AJAX method
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".login-form").addEventListener("submit", async function (e) {
        e.preventDefault()

        const login_form_data = {
            email: this.email.value,
            password: this.password.value
        }

        try {
            // request server to get this data
            const res = await fetch("/login-form", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(login_form_data)
            })

            // wait for server response
            const data = await res.json()

            const message = document.querySelector(".login-message")

            message.innerHTML = data.message
            message.style.color = data.type === "success" ? "green" : "red"

        } catch (err) {
            console.log(err);
        }
    })

    // when user input message disapear
    document.querySelector(".login-form").addEventListener("input", () => {
        document.querySelector(".login-message").innerHTML = "";
    })
})


//signup page in AJAX method
document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".signup-form");
    const message = document.querySelector(".signup-message");

    if (!form) {
        console.log("Form not found ❌");
        return;
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const signup_form_data = {
            first_name: this.first_name.value,
            last_name: this.last_name.value,
            email: this.email.value,
            password: this.password.value,
            confirm_password: this.confirm_password.value,
            gender: this.gender.value
        };

        try {
            const res = await fetch("/signup-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signup_form_data)
            });

            const data = await res.json();


            message.innerText = data.message;
            if (data.type === "success") {
                message.style.color = "green"

                // after 1sec redirect to login page
                setTimeout(() => {
                    window.location.href = "/login"
                }, 1000)
            } else {
                message.style.color = "red"
            }
            // message.style.color = data.type === "success" ? "green" : "red";


        } catch (err) {
            console.log("Error:", err);
        }
    });
    form.addEventListener("input", () => {
        if (message) message.innerHTML = ""
    })

});
