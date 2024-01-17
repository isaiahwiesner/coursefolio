document.addEventListener("DOMContentLoaded", () => {

    const renderUpcoming = () => {
        const now = new Date()
        const start = (
            new Date(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T00:00:00`).getTime()
        )
        const days = [0, 1, 2, 3, 4].map((i) => {
            return `${new Date(start + (i * 24 * 60 * 60 * 1000)).toDateString().split(" ")[0]}.  ${new Date(start + (i * 24 * 60 * 60 * 1000)).toString().split(" ").slice(1, 3).join(". ")}`
        })
        const schedule = [...[...course.schedule ? course.schedule : []].map((e) => {
            var data = {
                name: course.name,
                type: "CLASS",
                courseCode: course.courseCode,
                start: start - ((now.getDay() - new Date(course.start).getDay()) * 24 * 60 * 60 * 1000) + e[0],
                end: start - ((now.getDay() - new Date(course.start).getDay()) * 24 * 60 * 60 * 1000) + e[1],
            }
            if (new Date(data.start).getTimezoneOffset() != new Date(start).getTimezoneOffset()) {
                data.start = data.start + (new Date(data.start).getTimezoneOffset() - new Date(start).getTimezoneOffset()) * 60 * 1000
                data.end = data.end + (new Date(data.start).getTimezoneOffset() - new Date(start).getTimezoneOffset()) * 60 * 1000
            }
            return data
        }), ...marks.map((m) => {
            var mark = {
                name: m.name,
                type: m.markType,
                id: m.id
            }
            if (!m.startDate) {
                mark = { ...mark, start: m.endDate }
            }
            else {
                mark = { ...mark, start: m.startDate, end: m.endDate }
            }
            return mark
        })]
        schedule.sort((a, b) => a.start - b.start)
        for (var i = 0; i < 5; i++) {
            let dayDiv = document.getElementById(`weekly-day-${i}`)
            dayDiv.children[0].textContent = days[i]
            schedule.filter(s =>
                s.start > (start + (i * 24 * 60 * 60 * 1000)) && s.start < (start + ((i + 1) * 24 * 60 * 60 * 1000))
            ).forEach((s) => {
                let evt = document.createElement("p")
                let tm = document.createElement("span")
                let nm = document.createElement("span")
                if (s.type == "ASSIGNMENT") {
                    tm.textContent = `DUE ${new Date(s.start).toLocaleTimeString().slice(0, -6) + new Date(s.start).toLocaleTimeString().slice(-2)}`
                }
                else if (!s.end) {
                    tm.textContent = `${new Date(s.start).toLocaleTimeString().slice(0, -6) + new Date(s.start).toLocaleTimeString().slice(-2)}`
                }
                else {
                    tm.textContent = `${new Date(s.start).toLocaleTimeString().slice(0, -6) + new Date(s.start).toLocaleTimeString().slice(-2)}-${new Date(s.end).toLocaleTimeString().slice(0, -6) + new Date(s.end).toLocaleTimeString().slice(-2)}`
                }
                tm.classList.add("light-contrast")
                evt.append(tm)
                if (s.type == "CLASS" && s.courseCode) {
                    evt.append(` - ${s.courseCode} `)
                }
                else {
                    evt.append(" - ")
                }
                if (s.type != "CLASS") {
                    let markTag = document.createElement("span")
                    markTag.classList.add("marktype-tag")
                    markTag.classList.add(`marktype-${s.type.toLowerCase()}`)
                    markTag.textContent = s.type
                    evt.append(markTag)
                    evt.append(" ")
                }
                if (s.type == "CLASS") {
                    nm.textContent = s.name
                }
                else {
                    let evtLink = document.createElement("a")
                    evtLink.setAttribute("href", `/marks/${s.id}`)
                    evtLink.classList.add("link")
                    evtLink.textContent = s.name
                    evtLink.setAttribute("title", s.name)
                    nm.append(evtLink)
                }
                nm.classList.add("bold")
                evt.append(nm)
                dayDiv.append(evt)
            })
            if (schedule.filter(s => s.start > (start + (i * 24 * 60 * 60 * 1000)) && s.start < (start + ((i + 1) * 24 * 60 * 60 * 1000))).length == 0) {
                let none = document.createElement("p")
                none.textContent = "No events to display."
                none.classList.add("light-contrast")
                dayDiv.append(none)
            }
        }
    }

    renderUpcoming()

    const markAverage = document.getElementById("mark-average")
    const markCompleted = document.getElementById("mark-completed")
    const markAchieved = document.getElementById("mark-achieved")

    const renderMarkSummary = () => {
        const completed = marks.reduce((con, cur) => {
            if (cur.completed) {
                con += cur.weight
            }
            return con
        }, 0)
        const achieved = marks.reduce((con, cur) => {
            if (cur.completed) {
                if (!cur.totalMarks) {
                    con += cur.weight
                }
                else {
                    if (cur.marks) {
                        con += (cur.marks / cur.totalMarks) * cur.weight
                    }
                }
            }
            return con
        }, 0)
        const average = achieved * (100 / completed)
        markAverage.textContent = String(average) == "NaN"
            ? "--"
            : String(average).includes(".")
                ? String(average).split(".")[1].length > 1
                    ? average.toFixed(1) + "%"
                    : String(average) + "%"
                : String(average) + ".0%"
        markCompleted.textContent = String(completed).includes(".")
            ? String(completed).split(".")[1].length > 2
                ? completed.toFixed(2) + "%"
                : String(completed) + "%"
            : String(completed) + ".0%"
        markAchieved.textContent = String(achieved).includes(".")
            ? String(achieved).split(".")[1].length > 2
                ? achieved.toFixed(2) + "%"
                : String(achieved) + "%"
            : String(achieved) + ".0%"
    }

    renderMarkSummary()

    const recentMarksContainer = document.getElementById("recent-marks")

    const renderRecentMarks = () => {
        recentMarksContainer.innerHTML = ""
        const recentMarks = marks.filter((m) => {
            return m.completed
        })
        recentMarks.sort((a, b) => {
            return a.updatedAt - b.updatedAt
        })
        if (recentMarks.length > 0) {
            for (const m of recentMarks.slice(0, 5)) {
                let mark = document.createElement("section")
                mark.classList.add("recent-mark")
                let markTag = document.createElement("p")
                markTag.classList.add("marktype-tag")
                markTag.classList.add(`marktype-${m.markType.toLowerCase()}`)
                markTag.textContent = m.markType
                mark.append(markTag)
                let markName = document.createElement("h4")
                markName.textContent = `${m.name} (${String(m.weight).includes(".")
                    ? String(m.weight).split(".")[1].length > 2
                        ? m.weight.toFixed(2) + "%"
                        : String(m.weight) + "%"
                    : String(m.weight) + ".0%"})`
                mark.append(markName)
                let markPercent = document.createElement("p")
                if (!m.totalMarks) {
                    markPercent.textContent = "--/-- (--)"
                }
                else if (!m.marks) {
                    markPercent.textContent = `0/${m.totalMarks} (0.0%)`
                }
                else {
                    markPercent.textContent = `${m.marks}/${m.totalMarks} (${(m.marks / m.totalMarks * 100).toFixed(1)}%)`
                }
                mark.append(markPercent)
                let markUpdated = document.createElement("p")
                markUpdated.classList.add("light-contrast")
                let update = new Date(m.updatedAt - (new Date().getTimezoneOffset() * 60 * 1000))
                markUpdated.textContent = `Updated ${update.toDateString().split(" ")[1]}. ${update.getDate()}, ${update.toLocaleTimeString().slice(0, -6) + update.toLocaleTimeString().slice(-2)}`
                mark.append(markUpdated)
                let markLink = document.createElement("a")
                markLink.setAttribute("href", `/marks/${m.id}`)
                markLink.append(mark)
                markLink.setAttribute("title", m.name)
                recentMarksContainer.append(markLink)
            }
        }
        else {
            let none = document.createElement("p")
            none.classList.add("light-contrast")
            none.textContent = "No marks to display."
            recentMarksContainer.append(none)
        }
    }

    renderRecentMarks()

    const deleteBtn = document.getElementById("delete-course")

    const handleDelete = async () => {
        await fetch(`/api/courses?filter=${encodeURIComponent("id='" + course.id + "'")}`, {
            method: "DELETE"
        }).then(async (res) => {
            const data = await res.json()
            return [data, res.ok]
        }).then((res) => {
            const [_, ok] = res
            if (ok) {
                window.location = "/courses"
            }
        })
    }

    deleteBtn.addEventListener("click", handleDelete)
})