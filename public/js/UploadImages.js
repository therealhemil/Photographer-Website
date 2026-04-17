document.addEventListener("DOMContentLoaded", () => {

    //  ADD TITLE 
    document.querySelector(".add-title").addEventListener("submit", async (e) => {
        
        e.preventDefault();
        
        const title = e.target.title.value;
        
        try {
            const res = await fetch("/admin/upload-image/newTitle", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title })
            });
            
            if (!res.ok) throw new Error("Adding Title Error");
            
            const data = await res.json()
            
            //message show when title add
            const title_message = document.querySelector(".title-message")

        
                title_message.innerHTML = data.message
                title_message.style.color = data.type === "success" ? "green" : "red"
                // alert("Title Added Successfully");
        
            setTimeout(() => location.reload(), 800);

        } catch (err) {
            console.log(err);
            alert(err.message);
        }

    });



    let currentId = null;
    let files = [];

    const modal = document.getElementById("uploadModal");
    const fileInput = document.getElementById("fileInput");
    const dropArea = document.getElementById("dropArea");
    const fileList = document.getElementById("fileList");
    const uploadBtn = document.getElementById("uploadBtn");
    const browseBtn = document.getElementById("browseBtn");

    //  OPEN MODAL 
    document.querySelectorAll(".upload-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            currentId = this.dataset.id;
            const title = this.dataset.title

            console.log("ID:", currentId);
            console.log("Title:", title);

            if (!currentId) {
                alert("ID Missing!")
                return
            }

            uploadBtn.dataset.id = currentId
            uploadBtn.dataset.title = title

            modal.style.display = "flex";

            //set Modal title Dyanamically
            document.getElementById("modalTitle").innerHTML = `Upload Files to ${title}`

            files = [];
            // renderFiles();
        });
    });

    //  CLOSE MODAL 
    window.closeModal = function () {
        modal.style.display = "none";
    };

    document.querySelector(".close-btn").addEventListener("click", () => {
        closeModal()
    })

    // ESC CLOSE
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

    //  BROWSE FILE 
    browseBtn.addEventListener("click", () => {
        console.log("Browse button clicked");
        fileInput.click()
    });

    //  FILE INPUT 
    fileInput.addEventListener("change", (e) => {
        console.log("Change event registered");
        addFiles(e.target.files);
    });

    //  DRAG DROP 
    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.classList.add("dragover");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("dragover");
    });

    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.classList.remove("dragover");
        addFiles(e.dataTransfer.files);
    });

    //  ADD FILES 
    function addFiles(selectedFiles) {
        const newFiles = Array.from(selectedFiles);

        console.log("New Files", newFiles);

        newFiles.forEach(file => {
            console.log("file", file);
            const exists = files.some(f => f.name === file.name && f.size === file.size);
            console.log("Exists", exists);
            if (!exists) files.push(file);
            console.log("Files pushed", files);
        });

        renderFiles();
    }

    //  RENDER FILE LIST 
    function renderFiles() {
        fileList.innerHTML = "";
        
        const maxFilesShow = 5

        files.forEach((file, index) => {
            const div = document.createElement("div");
            div.className = "file-item";

            div.innerHTML = `
                ${file.name}
                <button data-index="${index}" class="remove-file">✖</button>
            `;

            fileList.appendChild(div);
        });

        // show more then files in ...
        if(files.length > maxFilesShow){
            const moreDiv = document.createElement("div")
            moreDiv.className = 'file-item more-files'
            moreDiv.innerHTML = `+${files.length - maxFilesShow} more...`
            fileList.appendChild(moreDiv)
        }

        uploadBtn.disabled = files.length === 0;
    }

    //  REMOVE FILE 
    fileList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-file")) {
            const index = e.target.dataset.index;
            files.splice(index, 1);
            renderFiles();
        }
    });


    //  UPLOAD 
    uploadBtn.addEventListener("click", async () => {

        console.log("Files", files);

        const id = uploadBtn.dataset.id
        const title = uploadBtn.dataset.title

        // console.log("Uploading to ID:", id);
        // console.log("uploding this title", title)

        if (!currentId) {
            alert("Upload ID missing!");
            return;
        }

        // console.log("Files length", files, files.length);

        if (files.length === 0) return;

        const formData = new FormData();
        // console.log(formData);

        files.forEach(file => formData.append("images", file));

        // console.log('Formdata', formData);

        try {
            const res = await fetch(`/admin/upload-image/${id}`, {
                method: "POST",
                body: formData
            });

            const data = await res.json()
            if (!res.ok) throw new Error(data.err || "Server Error Upload failed");
            else{   
                const upload_message = document.querySelector(".upload-message")
                
                upload_message.innerHTML = data.message
                upload_message.style.color = data.type === "success" ? "green" : "red"
                
                setTimeout(()=>{
                    closeModal();
                    location.reload();

                },1000)
                // alert("Upload Successful 🚀");
                
            }

        } catch (err) {
            console.error(err);
            alert(err.message || "Error Uploding Files.");
        }
    });


    //delete Image
    document.querySelectorAll(".delete-image-btn").forEach(btn => {
        btn.addEventListener("click", async () => {

            const id = btn.dataset.id
            const imageUrl = btn.dataset.img

            console.log(imageUrl);


            //confirmation msg
            const confirmDelete = confirm("Are you Sure You want to Delete this Image?")

            if (!confirmDelete) return

            try {
                const res = await fetch(`/admin/delete-image/${id}`, {
                    method: "DELETE",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ imageUrl })
                });

                const data = await res.json()

                if (!res.ok) throw new Error(data.message)
                else {

                    //remove form UI
                    // e.target.parentElement.remove()

                    alert("Deleted Successfully.")

                    setTimeout(() => {
                        location.reload()
                    }, 500)
                }
            } catch (err) {
                console.log(err);
                alert("Delete Failed")
            }


        })
    })





});