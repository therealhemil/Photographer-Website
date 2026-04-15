document.addEventListener("DOMContentLoaded", async () => {
    const dropArea = document.getElementById('dropArea')
    const fileInput = document.getElementById("fileInput");
    const browseBtn = document.getElementById("browseBtn");
    const fileList = document.getElementById("fileList");
    const uploadBtn = document.getElementById("uploadBtn");
    const progressBar = document.getElementById("progressBar");
    const progressContainer = document.getElementById("progressBarContainer");

    let files = []

    //open file picker
    browseBtn.onclick = () => fileInput.click()

    //handle file select
    fileInput.addEventListener('change', (e) => {
        addFiles(e.target.files)
    })

    //drag events
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault()
        dropArea.classList.add("active")
    })

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("active");
    });


    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.classList.remove("active");
        addFiles(e.dataTransfer.files);
    });

    // add files
    function addFiles(selected) {
        for (let file of selected){
            if(!files.find(f => f.name === file.name && f.size === file.size)){
                files.push(file)
            }
        }
        renderFiles()
    }

    //render UI
    function renderFiles(){
        fileList.innerHTML =""
        
        files.forEach((file, index)=>{
            const div = document.createElement("div")
            div.className = "file-item"

            div.innerHTML = `<span>${file.name}</span>
            <button onclick="removeFile(${index})">X</button>`

            fileList.appendChild(div)
        })
        uploadBtn.disabled = files.length === 0
    }


    //remove files
    function removeFile(index){
        files.splice(index, 1)
        renderFiles()
    }

    //upload files
    uploadBtn.addEventListener('click', async ()=>{
        if(files.length === 0) return
        
        const formData = new FormData()
        console.log(formData);
        
        files.forEach(file => formData.append('images', file))

        progressContainer.classList.remove("hidden")

        try{
            const res = await fetch("/admin/upload-Image", {
                method : 'POST',
                body : formData
            })

            const data = await res.json()

            if(!res.ok) {
                throw new error(data.error || "Upload Failed")
            }

            alert("upload Successful!")

            files = []
            renderFiles()
        }catch (err){
            alert(err.message || "error Uploding Files")
        }
    })


})