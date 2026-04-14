
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("usersTableBody")
    const form = document.getElementById("adminUserForm")
    const message = document.getElementById("adminMessage")
    const selectedUserBadge = document.getElementById("selectedUserBadge")
    const clearSelectionButton = document.getElementById("clearSelection")
    const searchInput = document.getElementById("userSearch")

    console.log(" Admin dashboard loaded")

    if (!tableBody || !form) return

    const fields = ["first_name", "last_name", "gender"]

    // Show message
    const setMessage = (text, type = "") => {
        message.textContent = text
        message.className = "admin-message"
        if (type) message.classList.add(type)
    }

    // Update stats
    const updateStats = () => {
        const rows = [...tableBody.querySelectorAll("tr[data-user-id]")]
        const total = rows.length
        const male = rows.filter(r => r.dataset.gender?.toLowerCase() === "male").length
        const female = rows.filter(r => r.dataset.gender?.toLowerCase() === "female").length
        const other = total - male - female

        document.querySelector('[data-stat="total"]').textContent = total
        document.querySelector('[data-stat="male"]').textContent = male
        document.querySelector('[data-stat="female"]').textContent = female
        document.querySelector('[data-stat="other"]').textContent = other
    }

    // Empty state
    const toggleEmptyState = () => {
        const hasUsers = tableBody.querySelector("tr[data-user-id]")
        const emptyRow = tableBody.querySelector(".empty-row")

        if (hasUsers && emptyRow) emptyRow.remove()

        if (!hasUsers && !emptyRow) {
            const row = document.createElement("tr")
            row.className = "empty-row"
            row.innerHTML = `<td colspan="6">No users found in the database yet.</td>`
            tableBody.appendChild(row)
        }
    }

    // Clear selection
    const clearSelection = () => {
        form.reset()
        document.getElementById("userId").value = ""
        selectedUserBadge.textContent = "No user selected"
        tableBody.querySelectorAll("tr.active").forEach(r => r.classList.remove("active"))
    }

    // Fill form
    const fillFormFromRow = (row) => {
        document.getElementById("userId").value = row.dataset.userId
        document.getElementById("first_name").value = row.dataset.firstName || ""
        document.getElementById("last_name").value = row.dataset.lastName || ""
        document.getElementById("gender").value = row.dataset.gender || ""

        tableBody.querySelectorAll("tr.active").forEach(r => r.classList.remove("active"))
        row.classList.add("active")

        selectedUserBadge.textContent = `Editing User #${row.dataset.userId}`
    }

    // Table actions
    tableBody.addEventListener("click", async (event) => {
        const row = event.target.closest("tr[data-user-id]")
        if (!row) return

        // EDIT
        if (event.target.classList.contains("edit-btn")) {
            fillFormFromRow(row)
            setMessage("")
        }

        // DELETE
        if (event.target.classList.contains("delete-btn")) {
            const userName = `${row.dataset.firstName} ${row.dataset.lastName}`.trim() || row.dataset.email

            if (!confirm(`Delete ${userName}? This cannot be undone.`)) return

            try {
                const res = await fetch(`/admin/users/${row.dataset.userId}`, {
                    method: "DELETE",
                    credentials: "include"
                })

                let data;
                try {
                    data = await res.json()
                }catch (err){
                    throw new Error("Server Returned invalid response (not Json)");
                    
                }
                
                if (!res.ok) throw new Error(data.message || "Delete failed")

                if (document.getElementById("userId").value === row.dataset.userId) {
                    clearSelection()
                }

                row.remove()
                toggleEmptyState()
                updateStats()

                setMessage(" User deleted successfully", "success")

            } catch (err) {
                console.error(err)
                setMessage( "User Deleting error", "error",err.message)
            }
        }
    })

    // UPDATE USER
    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const userId = document.getElementById("userId").value
        if (!userId) {
            setMessage(" Select a user first", "error")
            return
        }

        const payload = {}
        fields.forEach(f => payload[f] = form.elements[f].value.trim())

        try {
            const res = await fetch(`/admin/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            })

            let data;
                try {
                    data = await res.json()
                }catch (err){
                    throw new Error("Server Returned invalid response (not Json)");
                    
                }
            if (!res.ok) throw new Error(data.message || "Update failed")

            const row = tableBody.querySelector(`tr[data-user-id="${userId}"]`)

            if (row) {
                row.dataset.firstName = data.user.first_name || ""
                row.dataset.lastName = data.user.last_name || ""
                row.dataset.gender = data.user.gender || ""

                fields.forEach(f => {
                    const cell = row.querySelector(`[data-field="${f}"]`)
                    if (cell) cell.textContent = data.user[f] || "-"
                })
            }

            updateStats()
            setMessage(" User updated successfully", "success")

        } catch (err) {
            console.error(err)
            setMessage("Updating Error",err.message)
        }
    })

    // Clear button
    clearSelectionButton.addEventListener("click", () => {
        clearSelection()
        setMessage("")
    })

    // Search
    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase()

        tableBody.querySelectorAll("tr[data-user-id]").forEach(row => {
            const text = [
                row.dataset.userId,
                row.dataset.firstName,
                row.dataset.lastName,
                row.dataset.email,
                row.dataset.gender
            ].join(" ").toLowerCase()

            row.style.display = text.includes(keyword) ? "" : "none"
        })
    })

    // Init
    updateStats()
    toggleEmptyState()


// logout admin
document.querySelector('.admin_logout').addEventListener("click", async()=>{
        await fetch("/logout", {
            method: "POST"
        })

        window.location.href = "/admin"
    })


})



// document.addEventListener("DOMContentLoaded", () => {
//     const tableBody = document.getElementById("usersTableBody")
//     const form = document.getElementById("adminUserForm")
//     const message = document.getElementById("adminMessage")
//     const selectedUserBadge = document.getElementById("selectedUserBadge")
//     const clearSelectionButton = document.getElementById("clearSelection")
//     const searchInput = document.getElementById("userSearch")

//     console.log("script in admin_dashboard running...");
    
//     if (!tableBody || !form) return

//     const fields = ["first_name", "last_name", "email", "gender"]

//     //show Message
//     const setMessage = (text, type = "") => {
//         message.textContent = text
//         message.className = 'admin-message'

//         if (type) {
//             message.classList.add(type)
//         }
//     }

//     // update totaluser, and filter gender
//     const updateStats = () => {
//         const rows = [...tableBody.querySelectorAll("tr[data-user-id]")]
//         const total = rows.length
//         const male = rows.filter(row => row.dataset.gender.toLowerCase() === "male").length
//         const female = rows.filter(row => row.dataset.gender.toLowerCase() === 'female').length
//         const other = total - male - female

//         // set the value from server in dashboard
//         document.querySelector('[data-stat="total"]').textContent = total
//         document.querySelector('[data-stat="male"]').textContent = male
//         document.querySelector('[data-stat="female"]').textContent = female
//         document.querySelector('[data-stat="other"]').textContent = other
//     }

//     // if users are in data do not show empty-row message
//     const toggleEmptyState = () => {
//         const hasUsers = tableBody.querySelector("tr[data-user-id]")
//         const emptyrow = tableBody.querySelector(".empty-row")

//         // if users in database remove empty-row message
//         if (hasUsers && emptyrow) {
//             emptyrow.remove()
//         }

//         // if users are not in database then empty-row has below value
//         if (!hasUsers && !emptyrow) {
//             const row = document.createElement("tr")
//             row.className = "empty-row"
//             row.innerHTML = '<td colspan="6">No users found in the database yet.</td>'
//             tableBody.appendChild(row)
//         }
//     }

//     // clear selection
//     const clearSelection = () => {
//         form.reset()
//         document.getElementById("userId").value = ""
//         selectedUserBadge.textContent = "No user Selected"
//         tableBody.querySelectorAll("tr.active").forEach(
//             row => row.classList.remove("active")
//         )
//     }


//     // data modify from form
//     const fillFormFromRow = (row) => {
//         document.getElementById("userId").value = row.dataset.userId
//         document.getElementById("first_name").value = row.dataset.firstName || ""
//         document.getElementById("last_name").value = row.dataset.lastName || ""
//         // document.getElementById("email").value = row.dataset.email || ""
//         document.getElementById("gender").value = row.dataset.gender

//         tableBody.querySelectorAll("tr.active").forEach(item => item.classList.remove("active"))
//         row.classList.add("active")
//         selectedUserBadge.textContent = `Editing User #${row.dataset.userId}`
//     }

//     tableBody.addEventListener("click", async (event) => {
//         const row = event.target.closest("tr[data-user-id]")
//         if (!row) return

//         // create modify click action button
//         if (event.target.classList.contains("edit-btn")) {
//             fillFormFromRow(row)
//             setMessage("")
//         }

//         // create delete click action button
//         if (event.target.classList.contains("delete-btn")) {
//             const userName = `${row.dataset.firstName} ${row.dataset.lastName}`.trim() || row.dataset.email
//             const confirmed = window.confirm(`Do you Want to Delete this ${userName} User? This action cannot be undone.`)
//             if (!confirmed) return

//             try {
//                 const response = await fetch(`/admin/users/${row.dataset.userId}`, {
//                     method: "DELETE",
//                     credentials : 'include'
//                 })
//                 const data = await response.json()
//                 if (!response.ok) {
//                     throw new Error(data.message || "Unable to delete user")
//                 }

//                 if (document.getElementById('userId').value === row.dataset.userId) {
//                     clearSelection()
//                 }

//                 row.remove()
//                 toggleEmptyState()
//                 updateStats()
//                 setMessage(data.message, "success")
//             } catch (err) {
//                 console.log(err);
//                 setMessage(err.message, "error")
//             }

//         }
//     })

//     form.addEventListener("submit", async (event) => {
//         event.preventDefault()

//         const userId = document.getElementById('userId').value
//         if(!userId){
//             setMessage("Selecr a User first to modify their details", "error")
//             return
//         }

//         const payload = fields.reduce((accumulator, field) =>{
//             if(form.elements[field]){
//                 accumulator[field] = form.elements[field].value.trim()
//             }
//             return accumulator
//         }, {})

//         try{
//             const response = await fetch(`/admin/users/${userId}`,{
//                 method:"PUT",
//                 headers: {
//                     "content-type": "application/json"
//                 },
//                 credentials: 'include',
//                 body: JSON.stringify(payload)
//             })

//             const data = await response.json()
//             if(!response.ok){
//                 throw new Error(data.message || "Unable to update user");
//             }

//             const row = tableBody.querySelector(`tr[data-user-id="${userId}"]`)
//             if (row){
//                 row.dataset.firstName = data.user.first_name || "";
//                 row.dataset.lastName = data.user.last_name || "";
//                 // row.dataset.email = data.user.email || "";
//                 row.dataset.gender = data.user.gender || "";

//                 fields.forEach(field =>{
//                     const cell = row.querySelector(`[data-field="${field}"]`)
//                     if(cell){
//                         cell.textContent = data.user[field] || "-"
//                     }
//                 })
//             }

//             fillFormFromRow(row)
//             updateStats()
//             setMessage(data.message, "success")
//         } catch (err){
//             console.log(err);
//             setMessage(err.message, "error")
            
//         }
//     })

//     clearSelectionButton.addEventListener("click", ()=>{
//         clearSelection()
//         setMessage("")
//     })


//     // searhInput items
//     searchInput.addEventListener("input", ()=>{
//         const keyword = searchInput.value.trim().toLowerCase()
//         const rows = tableBody.querySelectorAll("tr[data-user-id]")

//         rows.forEach(row =>{
//             const searchableText = [
//                 row.dataset.userId,
//                 row.dataset.firstName,
//                 row.dataset.lastName,
//                 row.dataset.email,
//                 row.dataset.gender,
//             ].join(" ").toLowerCase()

//             row.style.display = searchableText.includes(keyword) ? "" : "none"
//         })
//     })
//     return ("Rows;", tableBody.querySelectorAll("tr"));
    
// })

