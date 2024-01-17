document.addEventListener("DOMContentLoaded", () => {
    var schedule = []
    const addForm = document.getElementById("add-form")
    const nameInput = document.getElementById("name")
    const courseCodeInput = document.getElementById("course-code")
    const classCodeInput = document.getElementById("class-code")
    const weeksInput = document.getElementById("weeks")
    const startInput = document.getElementById("start")
    const scheduleDayInput = document.getElementById("schedule-day")
    const scheduleStartInput = document.getElementById("schedule-start")
    const scheduleDurationInput = document.getElementById("schedule-duration")
    const readingWeekInput = document.getElementById("reading-week")
    const scheduleAddButton = document.getElementById("schedule-add")
    const scheduleListSection = document.getElementById("schedule-list")
    const addCourseError = document.getElementById("add-error")
    const addCourseBtn = document.getElementById("add-course")

    const render = (changeInputs = true) => {
        if (!startInput.value) {
            scheduleDayInput.value = ""
            scheduleDayInput.setAttribute("disabled", "true")
            scheduleDayInput.innerHTML = ""
            let option = document.createElement("option")
            option.setAttribute("value", "")
            option.textContent = "-- Day"
            scheduleDayInput.append(option)
        }
        else {
            scheduleDayInput.removeAttribute("disabled")
            if (changeInputs) {
                scheduleDayInput.innerHTML = ""
                let option = document.createElement("option")
                option.setAttribute("value", "")
                option.textContent = "-- Day"
                scheduleDayInput.append(option)
                var start = new Date(startInput.value + "T00:00:00").getTime()
                const days = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(",")
                for (var i = 0; i < 5; i++) {
                    let option = document.createElement("option")
                    option.setAttribute("value", i)
                    option.textContent = days[new Date(start + (i * 24 * 60 * 60 * 1000)).getDay()]
                    scheduleDayInput.append(option)
                }
            }
        }
        if (!scheduleDayInput.value || !scheduleStartInput.value || !scheduleDurationInput.value) {
            scheduleAddButton.setAttribute("disabled", "true")
        }
        else {
            scheduleAddButton.removeAttribute("disabled")
        }
        if (schedule.length == 0) {
            scheduleListSection.innerHTML = ""
            scheduleListSection.style.display = "none"
        }
        else {
            scheduleListSection.innerHTML = ""
            scheduleListSection.style.display = "flex"
            var start = new Date(startInput.value + "T00:00:00").getTime()
            schedule.forEach((s, i) => {
                var sec = document.createElement("section")
                sec.classList.add("input-list-item")
                sec.textContent = `${new Date(start + s[0]).toDateString().split(" ")[0]}. ${new Date(start + s[0]).toLocaleTimeString().slice(0, -6) + new Date(start + s[0]).toLocaleTimeString().slice(-2)}-${new Date(start + s[1]).toLocaleTimeString().slice(0, -6) + new Date(start + s[1]).toLocaleTimeString().slice(-2)}`
                let icon = document.createElement("span")
                icon.classList.add("material-symbols-outlined")
                icon.textContent = "close"
                icon.onclick = () => handleRemoveSched(i)
                sec.append(icon)
                scheduleListSection.append(sec)
            })
        }
    }

    const handleAddSched = () => {
        const start = new Date(startInput.value + "T00:00:00").getTime()
        const schedDay = parseInt(scheduleDayInput.value)
        const schedStart = new Date(`${new Date(start).getFullYear()}-${String(new Date(start).getMonth() + 1).padStart(2, "0")}-${String(new Date(start).getDate()).padStart(2, "0")}T${scheduleStartInput.value}`)
            .getTime() - start + (schedDay * 24 * 60 * 60 * 1000)
        const schedDur = parseInt(scheduleDurationInput.value)
        const schedEnd = schedStart + (schedDur * 60 * 1000)
        schedule.push([schedStart, schedEnd])
        scheduleDayInput.value = ""
        scheduleStartInput.value = ""
        scheduleDurationInput.value = ""
        render(false)
    }

    const handleRemoveSched = (index) => {
        schedule = [...schedule.slice(0, index), ...schedule.slice(index + 1)]
        render(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const handleAdd = async () => {
        addCourseError.style.display = "none"
        addCourseError.textContent = ""
        const name = nameInput.value.trim()
        const courseCode = courseCodeInput.value.trim() ? courseCodeInput.value.trim() : null
        const classCode = classCodeInput.value.trim() ? classCodeInput.value.trim() : null
        const weeks = parseInt(weeksInput.value)
        const start = new Date(startInput.value + "T00:00:00").getTime()
        const sched = schedule.length > 0 ? schedule.map((s) => {
            return `${s[0]}:${(s[1] - s[0]) / (60 * 1000)}`
        }).join(",") : null
        const readingWeek = readingWeekInput.value ? new Date(readingWeekInput.value + "T00:00:00").getTime() : null
        let invalid = []
        if (!name) invalid.push("name")
        if (String(weeks) == "NaN") invalid.push("weeks")
        else if (weeks < 1) invalid.push("weeks")
        else if (weeks > 52) invalid.push("weeks")
        if (String(start) == "NaN") invalid.push(start)
        if (invalid.length > 0) {
            addCourseError.style.display = "block"
            addCourseError.textContent = `The following fields are invalid: ${invalid.join(", ")}`
            return
        }
        const body = {
            name,
            courseCode,
            classCode,
            weeks,
            start,
            schedule: sched,
            readingWeek
        }
        await fetch("/api/courses", {
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
                window.location = `/courses/${data.course.id}`
            }
            else {
                addCourseError.style.display = "block"
                if (data.detail) {
                    addCourseError.textContent = data.detail
                }
                else {
                    addCourseError.textContent = "Unable to add course."
                }
            }
        })
    }

    startInput.value = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`
    addCourseError.style.display = "none"
    render()

    scheduleAddButton.addEventListener("click", handleAddSched)
    addForm.addEventListener("submit", handleSubmit)
    addCourseBtn.addEventListener("click", handleAdd)
    startInput.addEventListener("change", render)
    scheduleDayInput.addEventListener("change", () => render(false))
    scheduleStartInput.addEventListener("change", () => render(false))
    scheduleDurationInput.addEventListener("change", () => render(false))
})