import json
from fastapi import APIRouter, HTTPException, Request

from extensions import templates
from models import courses, CourseDataclass, marks, MarkDataclass


page_router = APIRouter(tags=["Pages"])


# Dashboard
@page_router.get("/")
def home_page(request: Request):
    course_data = [CourseDataclass(*x).to_dict() for x in courses.query_courses(order="name").fetchall()]
    return templates.TemplateResponse("pages/dashboard.html", {
        "request": request,
        "active_page": "dashboard",
        "courses": course_data
    })


# Courses
@page_router.get("/courses", tags=["Courses"])
def courses_page(request: Request):
    course_data = [CourseDataclass(*x).to_dict() for x in courses.query_courses(order="name").fetchall()]
    return templates.TemplateResponse("pages/courses/courses.html", {
        "request": request,
        "active_page": "courses",
        "courses": course_data
    })
# Add Course
@page_router.get("/courses/add", tags=["Courses"])
def add_course_page(request: Request):
    return templates.TemplateResponse("pages/courses/add_course.html", {
        "request": request
    })
# View Course
@page_router.get("/courses/{courseId}", tags=["Courses"])
def view_course(request: Request, courseId: str):
    course_query = courses.query_courses(filter=f'id="{courseId}"').fetchall()
    if len(course_query) == 0:
        raise HTTPException(status_code=404,
                            detail="Course not found.")
    course_data = CourseDataclass(*course_query[0]).to_dict()
    mark_data = [MarkDataclass(*x).to_dict() for x in marks.query_marks(filter=f'courseId="{courseId}"', order="endDate").fetchall()]
    return templates.TemplateResponse("pages/courses/course.html", {
        "request": request,
        "course": course_data,
        "marks": mark_data
    })
# View Course Calendar
@page_router.get("/courses/{courseId}/calendar", tags=["Courses"])
def course_calendar(request: Request, courseId: str):
    course_query = courses.query_courses(filter=f'id="{courseId}"').fetchall()
    if len(course_query) == 0:
        raise HTTPException(status_code=404,
                            detail="Course not found.")
    course_data = CourseDataclass(*course_query[0]).to_dict()
    mark_data = [MarkDataclass(*x).to_dict() for x in marks.query_marks(filter=f'courseId="{courseId}"', order="endDate").fetchall()]
    return templates.TemplateResponse("pages/courses/course_calendar.html", {
        "request": request,
        "course": course_data,
        "marks": mark_data
    })
# Course Marks
@page_router.get("/courses/{courseId}/marks", tags=["Courses"])
def course_marks_page(request: Request, courseId: str):
    course_query = courses.query_courses(filter=f'id="{courseId}"').fetchall()
    if len(course_query) == 0:
        raise HTTPException(status_code=404,
                            detail="Course not found.")
    course_data = CourseDataclass(*course_query[0]).to_dict()
    mark_data = [MarkDataclass(*x).to_dict() for x in marks.query_marks(filter=f'courseId="{courseId}"', order="endDate").fetchall()]
    return templates.TemplateResponse("pages/courses/course_marks.html", {
        "request": request,
        "course": course_data,
        "marks": mark_data
    })


# Add Mark
@page_router.get("/marks/add", tags=["Marks"])
def add_mark(request: Request, courseId: str = None):
    return templates.TemplateResponse("pages/marks/add_mark.html", {
        "request": request,
        "courseId": courseId
    })
# Update Mark
@page_router.get("/marks/{markId}", tags=["Marks"])
def add_mark(request: Request, markId: str = None):
    mark_query = marks.query_marks(filter=f'id="{markId}"').fetchall()
    if len(mark_query) == 0:
        raise HTTPException(status_code=404,
                            detail="Mark not found.")
    mark_data = MarkDataclass(*mark_query[0]).to_dict()
    return templates.TemplateResponse("pages/marks/update_mark.html", {
        "request": request,
        "mark": mark_data
    })