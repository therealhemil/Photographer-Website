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


})