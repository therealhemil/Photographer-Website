
// user input disappear messge
document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault()

    const inputs = document.querySelectorAll("input, textarea, select")
    const msg = document.querySelector(".message")
    // const signup_form = document.querySelector(".signup-form")

    inputs.forEach(input=>{
        input.addEventListener("input", ()=>{
            if(msg){
                msg.style.display = "none"
            }
        })
    })
})
        
        
        
        
        






    // prevent submit if not matched
    // if (signup_form) {
    //     signup_form.addEventListener("submit", function (e) {
    //         if (pass.value !== re_pass.value) {
    //             e.preventDefault();
    //             error_msg.innerHTML = "❌ Please match both passwords";
    //             error_msg.style.color = "red";
    //         }
    //     });
    // }