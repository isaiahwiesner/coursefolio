document.addEventListener("DOMContentLoaded", () => {
    const addForm = document.getElementById("add-form")
    const nameInput = document.getElementById("name")
    const markTypeInput = document.getElementById("mark-type")
    const startDateInput = document.getElementById("start-date")
    const startTimeInput = document.getElementById("start-time")
    const endDateInput = document.getElementById("end-date")
    const endTimeInput = document.getElementById("end-time")
    const marksInput = document.getElementById("marks")
    const totalMarksInput = document.getElementById("total-marks")
    const weightInput = document.getElementById("weight")
    const courseIdInput = document.getElementById("course-id")
    const addMarkError = document.getElementById("add-error")
    const addMarkBtn = document.getElementById("add-mark")

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const handleAdd = async () => {
        addMarkError.style.display = "none"
        addMarkError.textContent = ""
        const name = nameInput.value.trim()
        const markType = markTypeInput.value
        const startDate = startDateInput.value
        const startTime = startTimeInput.value
        const start = (!startDate || !startTime) ? null : new Date(`${startDate}T${startTime}:00`).getTime()
        const endDate = endDateInput.value
        const endTime = endTimeInput.value
        const end = (!endDate || !endTime) ? null : new Date(`${endDate}T${endTime}:00`).getTime()
        const marks = parseFloat(marksInput.value)
        const totalMarks = parseFloat(totalMarksInput.value)
        const weight = parseFloat(weightInput.value)
        const courseId = courseIdInput.value.trim()
        let invalid = []
        if (!name) invalid.push("name")
        if (!markType) invalid.push("markType")
        if (!end) invalid.push("endDate")
        if (String(marks) == "NaN" || marks < -1) invalid.push("marks")
        if (String(totalMarks) == "NaN" || totalMarks < -1 || totalMarks == 0) invalid.push("totalMarks")
        if (!weight || String(weight) == "NaN") invalid.push("weight")
        if (!courseId) invalid.push("courseId")
        if (invalid.length > 0) {
            addMarkError.style.display = "block"
            addMarkError.textContent = `The following fields are invalid: ${invalid.join(", ")}`
            return
        }
        const body = {
            name,
            markType,
            startDate: start,
            endDate: end,
            marks: marks == -1 ? null : marks,
            totalMarks: totalMarks == -1 ? null : totalMarks,
            weight,
            courseId
        }
        await fetch("/api/marks", {
            method: "POST",
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
                window.location = `/marks/${data.mark.id}`
            }
            else {
                addMarkError.style.display = "block"
                if (data.detail) {
                    addMarkError.textContent = data.detail
                }
                else {
                    addMarkError.textContent = "Unable to add mark."
                }
            }
        })
    }

    addForm.addEventListener("submit", handleSubmit)
    addMarkBtn.addEventListener("click", handleAdd)
})