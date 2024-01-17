document.addEventListener("DOMContentLoaded", () => {

    const now = new Date("2024-01-16T00:00:00")
    const monthNames = "January,February,March,April,May,June,July,August,September,October,November,December".split(",")
    const monthDays = [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const firstDay = new Date(course.start)
    const lastDay = new Date(firstDay.getTime() + ((course.weeks + (course.readingWeek ? 1 : 0)) * 7 * 24 * 60 * 60 * 1000) - (2 * 24 * 60 * 60 * 1000))
    let year = firstDay.getFullYear()

    const calTitle = document.getElementById("cal-title")
    const calBack = document.getElementById("cal-back")
    const calNext = document.getElementById("cal-next")
    const calDates = document.getElementById("cal-dates")

    let viewDate = new Date(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T00:00:00`)
    let viewMonths = [...Array(12).keys()].reduce((con, i) => {
        let month = (firstDay.getMonth() + i) % 12
        if (i != 0 && month == 0) {
            year += 1
        }
        let firstMonthDay = new Date(`${year}-${String(month + 1).padStart(2, "0")}-01T00:00:00`)
        let lastMonthDay = new Date(`${year}-${String(month + 1).padStart(2, "0")}-${String(monthDays[month] == -1 ?
            (firstMonthDay.getFullYear() % 4 == 0 ?
                29
                : 28)
            : monthDays[month]).padStart(2, "0")}T23:59:59`)
        if (firstMonthDay.getTime() <= lastDay.getTime()) {
            con.push([firstMonthDay.getTime(), lastMonthDay.getTime()])
        }
        return con
    }, [])

    let monthIndex = viewMonths.reduce((con, cur) => {
        if (cur[0] <= viewDate.getTime() && viewDate.getTime() <= cur[1]) con = viewMonths.indexOf(cur)
        return con
    }, 0)

    const getMonth = (index) => {
        return [new Date(viewMonths[index][0]), new Date(viewMonths[index][1])]
    }
    const render = () => {
        calTitle.innerText = `${monthNames[getMonth(monthIndex)[0].getMonth()]} ${getMonth(monthIndex)[0].getFullYear()}`
        calDates.innerHTML = ""

        var firstCalDay = new Date(getMonth(monthIndex)[0])
        var lastCalDay = new Date(getMonth(monthIndex)[1])
        const firstVisibleDay = new Date(firstCalDay.getTime() - (firstCalDay.getDay() * 24 * 60 * 60 * 1000))
        const lastVisibleDay = new Date(lastCalDay.getTime() + ((6 - lastCalDay.getDay()) * 24 * 60 * 60 * 1000))

        const schedule = [
            ...[...Array(6).keys()].reduce((con, i) => {
                return [...con, ...[...course.schedule ? course.schedule : []].reduce((con2, e) => {
                    if (
                        (firstVisibleDay.getTime() + (((firstVisibleDay.getDay() + new Date(course.start).getDay() + 7) % 7) * 24 * 60 * 60 * 1000)) + (i * 7 * 24 * 60 * 60 * 1000) + e[0] < lastVisibleDay.getTime()
                        && (firstVisibleDay.getTime() + (((firstVisibleDay.getDay() + new Date(course.start).getDay() + 7) % 7) * 24 * 60 * 60 * 1000)) + (i * 7 * 24 * 60 * 60 * 1000) + e[0] > course.start
                        && (firstVisibleDay.getTime() + (((firstVisibleDay.getDay() + new Date(course.start).getDay() + 7) % 7) * 24 * 60 * 60 * 1000)) + (i * 7 * 24 * 60 * 60 * 1000) + e[0] < course.start + (((course.weeks + (course.readingWeek ? 1 : 0)) * 7 - 2) * 24 * 60 * 60 * 1000)
                    ) {
                        con2.push({
                            name: course.name,
                            type: "CLASS",
                            courseCode: course.courseCode,
                            start: (firstVisibleDay.getTime() + (((firstVisibleDay.getDay() + new Date(course.start).getDay() + 7) % 7) * 24 * 60 * 60 * 1000)) + (i * 7 * 24 * 60 * 60 * 1000) + e[0],
                            end: (firstVisibleDay.getTime() + (((firstVisibleDay.getDay() + new Date(course.start).getDay() + 7) % 7) * 24 * 60 * 60 * 1000)) + (i * 7 * 24 * 60 * 60 * 1000) + e[1],
                        })
                    }
                    return con2
                }, [])]
            }, []),
            ...marks.map((m) => {
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

        var ri = 0
        for (var wi = 0; wi < 6; wi++) {
            for (var di = 0; di < 7; di++) {
                var date = new Date(firstVisibleDay.getTime() + (ri * 24 * 60 * 60 * 1000))
                if (di == 0 && lastCalDay.getTime() <= date.getTime()) {
                    break
                }
                var calDate = document.createElement("section")
                calDate.classList.add("calendar-date")
                if (date.getTime() < firstCalDay.getTime() || lastCalDay.getTime() < date.getTime()) {
                    calDate.classList.add("secondary")
                }
                var calDateText = document.createElement("h4")
                calDateText.textContent = `${date.toDateString().split(" ")[0]}. ${date.toDateString().split(" ")[1]}. ${date.getDate()}`
                calDate.append(calDateText)
                const evts = schedule.filter((s) => {
                    return (date.getTime() <= s.start && s.start < date.getTime() + (24 * 60 * 60 * 1000))
                })
                evts.forEach((s) => {
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
                    if (s.type == "CLASS") {
                        nm.textContent = s.name
                    }
                    else {
                        let evtLink = document.createElement("a")
                        evtLink.setAttribute("href", `/marks/${s.id}`)
                        evtLink.classList.add("link")
                        evtLink.textContent = s.name
                        nm.append(evtLink)
                    }
                    nm.classList.add("bold")
                    evt.append(nm)
                    calDate.append(evt)
                })
                calDates.append(calDate)
                ri += 1
            }
        }


        if (monthIndex == 0) {
            calBack.classList.add("disabled")
        }
        else {
            calBack.classList.remove("disabled")
        }
        if (monthIndex == viewMonths.length - 1) {
            calNext.classList.add("disabled")
        }
        else {
            calNext.classList.remove("disabled")
        }

    }

    render()

    const backMonth = () => {
        if (monthIndex == 0) return
        monthIndex = (monthIndex - 1) % viewMonths.length
        render()
    }
    const nextMonth = () => {
        if (monthIndex == viewMonths.length - 1) return
        monthIndex = (monthIndex + 1) % viewMonths.length
        render()
    }

    calBack.addEventListener("click", backMonth)
    calNext.addEventListener("click", nextMonth)
})