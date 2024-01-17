document.addEventListener("DOMContentLoaded", () => {
    const updateForm = document.getElementById("update-form")
    const nameInput = document.getElementById("name")
    const markTypeInput = document.getElementById("mark-type")
    const startDateInput = document.getElementById("start-date")
    const startTimeInput = document.getElementById("start-time")
    const endDateInput = document.getElementById("end-date")
    const endTimeInput = document.getElementById("end-time")
    const marksInput = document.getElementById("marks")
    const totalMarksInput = document.getElementById("total-marks")
    const weightInput = document.getElementById("weight")
    const completedInput = document.getElementById("completed")
    const updateMarkError = document.getElementById("update-error")
    const updateMarkBtn = document.getElementById("update-mark")
    const deleteMarkBtn = document.getElementById("delete-mark")

    for (const c of markTypeInput.children) {
        if (c.value == mark.markType) {
            c.setAttribute("selected", "true")
        }
    }
    var startValue = new Date(mark.startDate)
    if (mark.startDate && String(startValue) != "Invalid Date") {
        startValue = new Date(startValue.getTime() - (new Date().getTimezoneOffset() * 60 * 1000))
        startDateInput.value = startValue.toISOString().split("T")[0]
        startTimeInput.value = startValue.toISOString().split("T")[1].slice(0, 5)
    }
    var endValue = new Date(mark.endDate)
    if (String(endValue) != "Invalid Date") {
        endValue = new Date(endValue.getTime() - (new Date().getTimezoneOffset() * 60 * 1000))
        endDateInput.value = endValue.toISOString().split("T")[0]
        endTimeInput.value = endValue.toISOString().split("T")[1].slice(0, 5)
    }
    if (mark.marks) {
        marksInput.value = mark.marks
    }
    if (mark.totalMarks) {
        totalMarksInput.value = mark.totalMarks
    }
    if (mark.completed) {
        completedInput.children[1].setAttribute("selected", "true")
    }
    updateMarkError.style.display = "none"

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const handleUpdate = async () => {
        updateMarkError.style.display = "none"
        updateMarkError.textContent = ""
        const name = nameInput.value.trim()
        const markType = markTypeInput.value
        const startDate = startDateInput.value
        const startTime = startTimeInput.value
        const start = (!startDate || !startTime) ? null : new Date(`${startDate}T${startTime}:00`).getTime()
        const endDate = endDateInput.value
        const endTime = endTimeInput.value
        const end = (!endDate || !endTime) ? null : new Date(`${endDate}T${endTime}:00`).getTime()
        const marks = parseInt(marksInput.value)
        const totalMarks = parseInt(totalMarksInput.value)
        const weight = parseFloat(weightInput.value)
        const completed = completedInput.value.trim()
        let invalid = []
        if (!name) invalid.push("name")
        if (!markType) invalid.push("markType")
        if (!end) invalid.push("endDate")
        if (String(marks) == "NaN" || marks < -1) invalid.push("marks")
        if (String(totalMarks) == "NaN" || totalMarks < -1 || totalMarks == 0) invalid.push("totalMarks")
        if (!weight || String(weight) == "NaN") invalid.push("weight")
        if (invalid.length > 0) {
            updateMarkError.style.display = "block"
            updateMarkError.textContent = `The following fields are invalid: ${invalid.join(", ")}`
            return
        }
        const body = {
            name,
            markType,
            startDate: start,
            endDate: end,
            marks,
            totalMarks,
            weight,
            completed: completed.toLowerCase() == "true" ? true : false
        }
        await fetch(`/api/marks?filter=${encodeURIComponent("id='" + mark.id + "'")}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(async (res) => {
            const data = await res.json()
            return [data, res.ok]
        }).then((res) => {
            const [data, ok] = res
            if (ok) {
                window.location.reload()
            }
            else {
                updateMarkError.style.display = "block"
                if (data.detail) {
                    updateMarkError.textContent = data.detail
                }
                else {
                    updateMarkError.textContent = "Unable to update mark."
                }
            }
        })
    }

    const handleDelete = async () => {
        await fetch(`/api/marks?filter=${encodeURIComponent("id='" + mark.id + "'")}`, {
            method: "DELETE"
        }).then(async (res) => {
            const data = await res.json()
            return [data, res.ok]
        }).then((res) => {
            const [data, ok] = res
            if (ok) {
                window.location = `/courses/${mark.courseId}/marks`
            }
            else {
                updateMarkError.style.display = "block"
                if (data.detail) {
                    updateMarkError.textContent = data.detail
                }
                else {
                    updateMarkError.textContent = "Unable to update mark."
                }
            }
        })
    }

    updateForm.addEventListener("submit", handleSubmit)
    updateMarkBtn.addEventListener("click", handleUpdate)
    deleteMarkBtn.addEventListener("click", handleDelete)
})