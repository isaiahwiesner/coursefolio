import math
from typing import List
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pydantic.fields import Field

from models import courses, CourseDataclass, marks, MarkDataclass

api_router = APIRouter(tags=["API"])



# Create Course
class CreateCourseBody(BaseModel):
    name: str = Field()
    courseCode: str | None = Field(default=None)
    classCode: str | None = Field(default=None)
    weeks: int = Field(default=14)
    start: int = Field()
    schedule: List[str] | str | None = Field(default=None)
    readingWeek: int | None = Field(default=None)
@api_router.post("/courses", tags=["Courses"])
def create_course(body: CreateCourseBody):
    course = courses.add_course(name=body.name,
                                courseCode=body.courseCode,
                                classCode=body.classCode,
                                weeks=body.weeks,
                                start=body.start,
                                schedule=body.schedule,
                                readingWeek=body.readingWeek)
    return JSONResponse(content={"detail": "Course created.",
                                 "course": CourseDataclass(*course).to_dict()},
                        status_code=201)

# Get Courses
@api_router.get("/courses", tags=["Courses"])
def get_courses(page: int=1, per_page: int=10, filter: str = None, order: str = None):
    count = len(courses.query_courses(filter=filter, order=order).fetchall())
    pages = math.ceil(count/per_page)
    if page != 1 and page > pages:
        page = pages
    if page < 1:
        page = 1
    return JSONResponse(content={"count": count,
                                 "page": page,
                                 "per_page": per_page,
                                 "courses": [CourseDataclass(*x).to_dict() for x in courses.query_courses(filter=filter, order=order, skip=(per_page*(page-1)), limit=per_page).fetchall()]},
                        status_code=200)
# Get Course
@api_router.get("/course/{courseId}", tags=["Courses"])
def get_course(courseId: str):
    query = courses.query_courses(filter=f'id = "{courseId}"').fetchall()
    if len(query) == 0:
        raise HTTPException(status_code=404,
                            detail="Course not found.")
    return JSONResponse(content={"course": CourseDataclass(*query[0]).to_dict()},
                        status_code=200)

# Update Courses
class UpdateCourseBody(BaseModel):
    name: str | None = Field(default=None)
    courseCode: str | None = Field(default=None)
    classCode: str | None = Field(default=None)
    weeks: int | None = Field(default=None)
    start: int | None = Field(default=None)
    schedule: List[str] | str | None = Field(default=None)
    readingWeek: int | None = Field(default=None)
    # Get updates
    def get_updates(self) -> dict:
        updates = {}
        if self.name != None:
            updates["name"] = self.name
        if self.courseCode != None:
            if self.courseCode == "$NULL":
                self.courseCode = None
            else:
                updates["courseCode"] = self.courseCode
        if self.classCode != None:
            if self.classCode == "$NULL":
                self.classCode = None
            else:
                updates["classCode"] = self.classCode
        if self.weeks != None:
            updates["weeks"] = self.weeks
        if self.start != None:
            updates["start"] = self.start
        if self.schedule != None:
            if self.schedule == "$NULL":
                self.schedule = None
            else:
                updates["schedule"] = self.schedule
        if self.readingWeek != None:
            if self.readingWeek == -1:
                self.readingWeek = None
            else:
                updates["readingWeek"] = self.readingWeek
        return updates
@api_router.put("/courses", tags=["Courses"])
def update_courses(body: UpdateCourseBody, filter: str = None, order: str = None):
    if not filter:
        raise HTTPException(status_code=400,
                            detail="Filter cannot be empty.")
    update = courses.update_courses(update=body.get_updates(), filter=filter, order=order)
    return JSONResponse(content={"detail": f'{len(update)} course{"s" if len(update) != 1 else ""} updated.',
                                 "courses": [CourseDataclass(*x).to_dict() for x in update]},
                        status_code=200)

# Delete Courses
@api_router.delete("/courses", tags=["Courses"])
def update_courses(filter: str = None, order: str = None):
    if not filter:
        raise HTTPException(status_code=400,
                            detail="Filter cannot be empty.")
    deleted = courses.delete_courses(filter=filter, order=order)
    return JSONResponse(content={"detail": f'{len(deleted)} course{"s" if len(deleted) != 1 else ""} deleted.',
                                 "courses": [CourseDataclass(*x).to_dict() for x in deleted]},
                        status_code=200)


# Create Mark
class CreateMarkBody(BaseModel):
    name: str = Field()
    markType: str = Field()
    startDate: int | None = Field(default=None)
    endDate: int = Field()
    marks: float | None = Field(default=None)
    totalMarks: float | None = Field(default=None)
    weight: float = Field()
    courseId: str = Field()
@api_router.post("/marks", tags=["Marks"])
def create_mark(body: CreateMarkBody):
    q_courses = courses.query_courses(filter=f'id = "{body.courseId}"').fetchall()
    if len(q_courses) == 0:
        raise HTTPException(status_code=404,
                            detail="Course not found.")
    if body.markType.upper() not in [x for x in marks.get_fields() if x.get_name() == "markType"][0].get_options():
        raise HTTPException(status_code=400,
                            detail=f'Invalid option for field markType: "{body.markType.upper()}"')
    mark = marks.add_mark(name=body.name,
                          markType=body.markType.upper(),
                          startDate=body.startDate,
                          endDate=body.endDate,
                          marks=body.marks,
                          totalMarks=body.totalMarks,
                          weight=body.weight,
                          courseId=body.courseId)
    return JSONResponse(content={"detail": "Mark created.",
                                 "mark": MarkDataclass(*mark).to_dict()},
                        status_code=201)

# Get marks
@api_router.get("/marks", tags=["Marks"])
def get_marks(page: int=1, per_page: int=10, filter: str = None, order: str = None):
    count = len(marks.query_marks(filter=filter, order=order).fetchall())
    pages = math.ceil(count/per_page)
    if page != 1 and page > pages:
        page = pages
    if page < 1:
        page = 1
    return JSONResponse(content={"count": count,
                                 "page": page,
                                 "per_page": per_page,
                                 "marks": [MarkDataclass(*x).to_dict() for x in marks.query_marks(filter=filter, order=order, skip=(per_page*(page-1)), limit=per_page).fetchall()]},
                        status_code=200)
# Get Mark
@api_router.get("/mark/{markId}", tags=["Marks"])
def get_mark(markId: str):
    query = marks.query_marks(filter=f'id = "{markId}"').fetchall()
    if len(query) == 0:
        raise HTTPException(status_code=404,
                            detail="Mark not found.")
    return JSONResponse(content={"mark": MarkDataclass(*query[0]).to_dict()},
                        status_code=200)

# Update Marks
class UpdateMarkBody(BaseModel):
    name: str | None = Field(default=None)
    markType: str | None = Field(default=None)
    startDate: int | None = Field(default=None)
    endDate: int | None = Field(default=None)
    marks: float | None = Field(default=None)
    totalMarks: float | None = Field(default=None)
    weight: float | None = Field(default=None)
    completed: bool | None = Field(default=None)
    # Get updates
    def get_updates(self) -> dict:
        updates = {}
        if self.name != None:
            updates["name"] = self.name
        if self.markType != None:
            updates["markType"] = self.markType
        if self.startDate != None:
            updates["startDate"] = self.startDate
        if self.endDate != None:
            updates["endDate"] = self.endDate
        if self.marks != None:
            updates["marks"] = self.marks
        if self.totalMarks != None:
            updates["totalMarks"] = self.totalMarks
        if self.weight != None:
            updates["weight"] = self.weight
        if self.completed != None:
            updates["completed"] = self.completed
        return updates
@api_router.put("/marks", tags=["Marks"])
def update_marks(body: UpdateMarkBody, filter: str = None, order: str = None):
    if not filter:
        raise HTTPException(status_code=400,
                            detail="Filter cannot be empty.")
    update = marks.update_marks(update=body.get_updates(), filter=filter, order=order)
    return JSONResponse(content={"detail": f'{len(update)} mark{"s" if len(update) != 1 else ""} updated.',
                                 "marks": [MarkDataclass(*x).to_dict() for x in update]},
                        status_code=200)

# Delete Marks
@api_router.delete("/marks", tags=["Marks"])
def update_marks(filter: str = None, order: str = None):
    if not filter:
        raise HTTPException(status_code=400,
                            detail="Filter cannot be empty.")
    deleted = marks.delete_marks(filter=filter, order=order)
    return JSONResponse(content={"detail": f'{len(deleted)} mark{"s" if len(deleted) != 1 else ""} deleted.',
                                 "marks": [MarkDataclass(*x).to_dict() for x in deleted]},
                        status_code=200)