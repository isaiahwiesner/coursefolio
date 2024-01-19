document.addEventListener("DOMContentLoaded", () => {
    const renderMarkInfo = () => {
        const markActual = document.getElementById("mark-actual")
        const markPercent = document.getElementById("mark-percentage")
        const markAchieved = document.getElementById("mark-achieved")
        if (mark.marks == null || mark.totalMarks == null) {
            markActual.textContent = "--"
            markPercent.textContent = "--"
            markAchieved.textContent = "0.0%"
        }
        else {
            let percent = mark.marks / mark.totalMarks * 100
            let achieved = mark.marks / mark.totalMarks * mark.weight
            markActual.textContent = `${mark.marks}/${mark.totalMarks}`
            markPercent.textContent = percent.toFixed(1) + "%"
            markAchieved.textContent = String(achieved).includes(".")
                ? String(achieved).split(".")[1].length > 2
                    ? achieved.toFixed(2) + "%"
                    : String(achieved) + "%"
                : String(achieved) + ".0%"
        }
    }
    renderMarkInfo()

    const renderTimeInfo = () => {
        const endDate = document.getElementById("endDate")
        const end = new Date(mark.endDate)
        endDate.textContent = `${end.toDateString().split(" ")[0]}. ${end.toDateString().split(" ")[1]}. ${end.getDate()}, ${end.toLocaleTimeString().slice(0, -6) + end.toLocaleTimeString().slice(-2)}`
        if (mark.markType != "ASSIGNMENT" && mark.startDate) {
            const startDate = document.getElementById("startDate")
            const start = new Date(mark.startDate)
            startDate.textContent = `${start.toDateString().split(" ")[0]}. ${start.toDateString().split(" ")[1]}. ${start.getDate()}, ${start.toLocaleTimeString().slice(0, -6) + start.toLocaleTimeString().slice(-2)}`
        }
    }
    renderTimeInfo()
})