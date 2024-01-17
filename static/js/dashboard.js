document.addEventListener("DOMContentLoaded", () => {
    const start = new Date(courses[0].start).getTime()
    const dayNames = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(",")
    const days = [0, 1, 2, 3, 4].map((i) => {
        return dayNames[new Date(start + (i * 24 * 60 * 60 * 1000)).getDay()]
    })
    const schedule = [...courses ? courses : []].reduce((con, course) => {
        con.push(...course.schedule.map((e) => {
            return {
                name: course.name,
                courseCode: course.courseCode,
                start: start + e[0],
                end: start + e[1],
            }
        }))
        return con
    }, [])
    schedule.sort((a, b) => a.start - b.start)
    for (var i = 0; i < 5; i++) {
        let dayDiv = document.getElementById(`weekly-day-${i}`)
        dayDiv.children[0].textContent = days[i]
        schedule.filter(s => s.start > (start + (i * 24 * 60 * 60 * 1000)) && s.start < (start + ((i + 1) * 24 * 60 * 60 * 1000))).forEach((s) => {
            let evt = document.createElement("p")
            let tm = document.createElement("span")
            let nm = document.createElement("span")
            tm.textContent = `${new Date(s.start).toLocaleTimeString().slice(0, -6) + new Date(s.start).toLocaleTimeString().slice(-2)}-${new Date(s.end).toLocaleTimeString().slice(0, -6) + new Date(s.end).toLocaleTimeString().slice(-2)}`
            tm.classList.add("light-contrast")
            evt.append(tm)
            evt.append(` - ${s.courseCode} `)
            nm.textContent = s.name
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
})