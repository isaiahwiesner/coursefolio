document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".course p:not(.course.add-course p)").forEach((p, i) => {
        const start = new Date(courses[i].start).getTime()
        const sched = [...courses[i].schedule ? courses[i].schedule : []]
        sched.filter((a, b) => a[0] - b[0])
        const times = sched.map((s) => {
            let st = new Date(start + s[0])
            let et = new Date(start + s[1])
            return `${st.toDateString().split(" ")[0]}. ${st.toLocaleTimeString().slice(0, -6) + st.toLocaleTimeString().slice(-2)}-${et.toLocaleTimeString().slice(0, -6) + et.toLocaleTimeString().slice(-2)}`
        })
        p.textContent = times.join(", ")
    })
})