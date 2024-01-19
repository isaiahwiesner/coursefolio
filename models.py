from dataclasses import asdict, dataclass
from dotenv import load_dotenv
from typing import List
from uuid import uuid4
from datetime import datetime
import math
import sqlite3
import time
import os

load_dotenv()
DATABASE_URL = os.getenv("SQL_CONNECTION_URL")


con = sqlite3.connect(DATABASE_URL, check_same_thread=False)


class SQLTextField:
    def __init__(self,
                 name: str,
                 length: int | None = None,
                 options: List[str] | None = None,
                 nullable: bool = True,
                 primary_key: bool = False,
                 unique: bool = False,
                 default: str | None | bool = False):
        self.__name__ = name
        if length != None:
            if length < 1:
                length = 1
            if length > 255:
                length = 255
        self.__length__ = length
        self.__options__ = options
        self.__nullable__ = nullable
        self.__default__ = None
        self.__primary_key__ = primary_key
        self.__unique__ = unique
        self.__default__ = default
    # Get name
    def get_name(self) -> str:
        return self.__name__
    # Get length
    def get_length(self) -> int | None:
        return self.__length__
    # Get options
    def get_options(self) -> List[str] | None:
        return self.__options__
    # Check is nullable
    def is_nullable(self) -> bool:
        return self.__nullable__
    # Check is primary key
    def is_primary_key(self) -> bool:
        return self.__primary_key__
    # Check is unique
    def is_unique(self) -> bool:
        return self.__unique__
    # Get default value
    def get_default_value(self) -> str | None:
        return self.__default__
    # Get definition
    def get_def(self) -> str:
        def_string = f'{self.get_name()} STRING'
        if self.get_length() != None:
            def_string = f'{def_string}({self.get_length()})'
        if not self.is_nullable():
            def_string = f'{def_string} NOT NULL'
        if self.is_primary_key():
            def_string = f'{def_string} PRIMARY KEY'
        if self.is_unique():
            def_string = f'{def_string} UNIQUE'
        if self.get_default_value() != False:
            if self.get_default_value() == None:
                def_string = f'{def_string} default(null)'
            else:
                def_string = f'{def_string} default({self.get_default_value()})'
        if self.get_options() != None and len(self.get_options()) > 0:
            like_str = f' OR {self.get_name()} LIKE '.join(["'%" + x + "%'" for x in self.get_options()])
            def_string = f'{def_string} CHECK({self.get_name()} LIKE {like_str})'
        return def_string

class SQLIntField:
    def __init__(self,
                 name: str,
                 min: int | None = None,
                 max: int | None = None,
                 nullable: bool = True,
                 primary_key: bool = False,
                 unique: bool = False,
                 default: int | None | bool = False):
        self.__name__ = name
        self.__min__ = min
        self.__max__ = max
        self.__nullable__ = nullable
        self.__default__ = None
        self.__primary_key__ = primary_key
        self.__unique__ = unique
        self.__default__ = default
    # Get name
    def get_name(self) -> str:
        return self.__name__
    # Get min
    def get_min(self) -> int | None:
        return self.__min__
    # Get max
    def get_max(self) -> int | None:
        return self.__max__
    # Check is nullable
    def is_nullable(self) -> bool:
        return self.__nullable__
    # Check is primary key
    def is_primary_key(self) -> bool:
        return self.__primary_key__
    # Check is unique
    def is_unique(self) -> bool:
        return self.__unique__
    # Get default value
    def get_default_value(self) -> int | None:
        return self.__default__
    # Get definition
    def get_def(self) -> str:
        def_string = f'{self.get_name()} INTEGER'
        if not self.is_nullable():
            def_string = f'{def_string} NOT NULL'
        if self.is_primary_key():
            def_string = f'{def_string} PRIMARY KEY'
        if self.is_unique():
            def_string = f'{def_string} UNIQUE'
        if self.get_default_value() != False:
            if self.get_default_value() == None:
                def_string = f'{def_string} default(null)'
            else:
                def_string = f'{def_string} default({self.get_default_value()})'
        if self.get_min() != None and self.get_max() != None:
            def_string = f'{def_string} CHECK({self.get_name()} BETWEEN {self.get_min()} AND {self.get_max()})'
        elif self.get_min() != None:
            def_string = f'{def_string} CHECK({self.get_name()} >= {self.get_min()})'
        elif self.get_max() != None:
            def_string = f'{def_string} CHECK({self.get_name()} <= {self.get_max()})'
        return def_string
        
class SQLFloatField:
    def __init__(self,
                 name: str,
                 min: float | None = None,
                 max: float | None = None,
                 nullable: bool = True,
                 primary_key: bool = False,
                 unique: bool = False,
                 default: float | None | bool = False):
        self.__name__ = name
        self.__min__ = min
        self.__max__ = max
        self.__nullable__ = nullable
        self.__default__ = None
        self.__primary_key__ = primary_key
        self.__unique__ = unique
        self.__default__ = default
    # Get name
    def get_name(self) -> str:
        return self.__name__
    # Get min
    def get_min(self) -> float | None:
        return self.__min__
    # Get max
    def get_max(self) -> float | None:
        return self.__max__
    # Check is nullable
    def is_nullable(self) -> bool:
        return self.__nullable__
    # Check is primary key
    def is_primary_key(self) -> bool:
        return self.__primary_key__
    # Check is unique
    def is_unique(self) -> bool:
        return self.__unique__
    # Get default value
    def get_default_value(self) -> int | None:
        return self.__default__
    # Get definition
    def get_def(self) -> str:
        def_string = f'{self.get_name()} FLOAT'
        if not self.is_nullable():
            def_string = f'{def_string} NOT NULL'
        if self.is_primary_key():
            def_string = f'{def_string} PRIMARY KEY'
        if self.is_unique():
            def_string = f'{def_string} UNIQUE'
        if self.get_default_value() != False:
            if self.get_default_value() == None:
                def_string = f'{def_string} default(null)'
            else:
                def_string = f'{def_string} default({self.get_default_value()})'
        if self.get_min() != None and self.get_max() != None:
            def_string = f'{def_string} CHECK({self.get_name()} BETWEEN {self.get_min()} AND {self.get_max()})'
        elif self.get_min() != None:
            def_string = f'{def_string} CHECK({self.get_name()} >= {self.get_min()})'
        elif self.get_max() != None:
            def_string = f'{def_string} CHECK({self.get_name()} <= {self.get_max()})'
        return def_string
    
class SQLBoolField:
    def __init__(self,
                 name: str,
                 nullable: bool = True,
                 primary_key: bool = False,
                 unique: bool = False,
                 default: bool | None = False):
        self.__name__ = name
        self.__nullable__ = nullable
        self.__default__ = None
        self.__default__ = default
    # Get name
    def get_name(self) -> str:
        return self.__name__
    # Check is nullable
    def is_nullable(self) -> bool:
        return self.__nullable__
    # Get default value
    def get_default_value(self) -> bool | None:
        return self.__default__
    # Get definition
    def get_def(self) -> str:
        def_string = f'{self.get_name()} BOOLEAN'
        if not self.is_nullable():
            def_string = f'{def_string} NOT NULL'
        if self.get_default_value() == None:
            def_string = f'{def_string} default(null)'
        else:
            def_string = f'{def_string} default({self.get_default_value()})'
        return def_string

class SQLTableBaseModel:
    def __init__(self, tablename, fields: List[SQLTextField]):
        self.__tablename__ = tablename
        self.__fields__ = fields
    # Get table name
    def get_tablename(self) -> str:
        return self.__tablename__
    def get_fields(self) -> List[SQLTextField]:
        return self.__fields__
    # Get table definition
    def get_table_def(self) -> str:
        return f'CREATE TABLE {self.get_tablename()}({", ".join([x.get_def() for x in self.get_fields()])})'
    # Create
    def create(self):
        cur = con.cursor()
        cur.execute(self.get_table_def())
    # Create if not exists
    def create_if_not_exists(self):
        cur = con.cursor()
        cur.execute(f'{self.get_table_def()[:12]} IF NOT EXISTS {self.get_table_def()[13:]}')



class Courses(SQLTableBaseModel):
    def __init__(self,
                 fields: List[SQLTextField]):
        super().__init__(tablename="courses",
                         fields=fields)
    # Add course
    def add_course(self,
                   name: str,
                   courseCode: str | None,
                   classCode: str | None,
                   weeks: int = 14,
                   start: int | datetime | None = None,
                   schedule: str | List[str] | None = None,
                   readingWeek: int | datetime | None = None):
        cur = con.cursor()
        id = str(uuid4())
        cur.execute("INSERT INTO courses VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (name,
                                                                   (courseCode if courseCode != None else None),
                                                                   (classCode if classCode != None else None),
                                                                   weeks,
                                                                   (
                                                                       int(time.mktime(datetime.utcnow().timetuple())*1000)
                                                                       if start == None
                                                                       else int(time.mktime(start.timetuple())*1000)
                                                                       if type(start) == datetime
                                                                       else start
                                                                   ),
                                                                   (
                                                                       ",".join(schedule)
                                                                       if type(schedule) == list
                                                                       else schedule
                                                                       if type(schedule) == str
                                                                       else None
                                                                   ),
                                                                   (
                                                                       int(time.mktime(readingWeek.timetuple())*1000)
                                                                       if type(readingWeek) == datetime
                                                                       else readingWeek
                                                                       if type(readingWeek) == int
                                                                       else None
                                                                   ),
                                                                   int(time.mktime(datetime.utcnow().timetuple())*1000),
                                                                   int(time.mktime(datetime.utcnow().timetuple())*1000),
                                                                   id))
        con.commit()
        return cur.execute(f'SELECT * FROM courses WHERE id = "{id}"').fetchone()
    # Get courses
    def query_courses(self,
                    select: tuple | str = "*",
                    filter: str | None = None,
                    order: str | None = None,
                    limit: int | None = None,
                    skip: int | None = None) -> sqlite3.Cursor:
        cur = con.cursor()
        q_string = f'SELECT {select if type(select) == str else ", ".join([x for x in select])} FROM courses'
        if filter:
            q_string = f'{q_string} WHERE {filter}'
        if order:
            q_string = f'{q_string} ORDER BY {order}'
        if limit:
            if limit >= 1:
                q_string = f'{q_string} LIMIT {limit}'
        if skip:
            if skip >= 1:
                q_string = f'{q_string} OFFSET {skip}'
        return cur.execute(q_string)
    # Update courses
    def update_courses(self,
                       update: dict,
                       filter: str,
                       order: str | None = None):
        update = {**update, "updatedAt": time.mktime(datetime.utcnow().timetuple())*1000}
        if "schedule" in update.keys():
            if type(update["schedule"]) == list:
                update["schedule"] = ",".join(update["schedule"])
        cur = con.cursor()
        q_string = f'UPDATE courses'
        q_string = f'{q_string} SET {", ".join([(k + " = " + "?") for k in update.keys()])}'
        q_string = f'{q_string} WHERE {filter}'
        if order:
            q_string = f'{q_string} ORDER BY {order}'
        print(q_string)
        cur.execute(q_string, [(None if update[k] in (-1, "$NULL") else update[k]) for k in update.keys()])
        con.commit()
        return cur.execute(f'SELECT * FROM courses WHERE {filter}').fetchall()
    # Delete courses
    def delete_courses(delf,
                     filter: str,
                     order: str | None = None) -> list:
        cur = con.cursor()
        q_string = f'DELETE FROM courses WHERE {filter}'
        if order:
            q_string = f'{q_string} ORDER BY {order}'
        data = cur.execute(f'SELECT * FROM courses WHERE {filter}').fetchall()
        ids = {*[x[0] for x in cur.execute(f'SELECT id FROM courses WHERE {filter}').fetchall()]}
        try:
            return data
        finally:
            for id in ids:
                cur.execute(f'DELETE FROM marks WHERE courseId="{id}"')
            cur.execute(q_string)
            con.commit()

@dataclass
class CourseDataclass:
    name: str
    courseCode: str
    classCode: str
    weeks: int
    start: int
    schedule: str | List[str] | None
    readingWeek: int
    createdAt: int
    updatedAt: int
    id: str
    # To dict
    def to_dict(self) -> dict:
        try:
            if type(self.schedule) == list:
                self.schedule = ",".join(self.schedule)
            if type(self.schedule) == str:
                self.schedule = [[int(x.split(":")[0]), int(x.split(":")[0])+(int(x.split(":")[1])*60*1000)] for x in self.schedule.split(",")]
            return asdict(self)
        finally:
            if self.schedule != None:
                if len(self.schedule) > 0:
                    self.schedule = ",".join([f'{x[0]}:{x[1]/60*1000}' for x in self.schedule])
                else:
                    self.schedule = ""

courses = Courses(fields=[
                      SQLTextField(name="name", nullable=False),
                      SQLTextField(name="courseCode", default=None),
                      SQLTextField(name="classCode", default=None),
                      SQLIntField(name="weeks", nullable=False, min=1, max=52, default=14),
                      SQLIntField(name="start", nullable=False, min=0),
                      SQLTextField(name="schedule", default=None),
                      SQLIntField(name="readingWeek", default=None, min=0),
                      SQLIntField(name="createdAt", nullable=False, min=0),
                      SQLIntField(name="updatedAt", nullable=False, min=0),
                      SQLTextField(name="id", nullable=False, primary_key=True, unique=True)
                  ])


class Marks(SQLTableBaseModel):
    def __init__(self,
                 fields: List[SQLTextField]):
        super().__init__(tablename="marks",
                         fields=fields)
    # Add mark
    def add_mark(self,
                   name: str,
                   markType: str,
                   courseId: str,
                   endDate: int | datetime,
                   startDate: int | datetime | None = None,
                   marks: float | None = None,
                   totalMarks: int | None = None,
                   weight: float | None = None,):
        cur = con.cursor()
        id = str(uuid4())
        (course_start, reading_week) = courses.query_courses(select=("start", "readingWeek"), filter=f'id="{courseId}"').fetchone()
        cur.execute("INSERT INTO marks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (name,
                     markType,
                     math.ceil(((int(time.mktime(endDate.timetuple())*1000)
                                 if type(endDate) == datetime
                                 else endDate)-course_start)/(7*24*60*60*1000))+(-1 if (int(time.mktime(endDate.timetuple())*1000)
                                                                                       if type(endDate) == datetime
                                                                                       else endDate) > reading_week
                                                                                 else 0),
                     (
                         int(time.mktime(startDate.timetuple())*1000)
                         if type(startDate) == datetime
                         else startDate
                         if type(startDate) == int
                         else None
                     ),
                     (
                         int(time.mktime(endDate.timetuple())*1000)
                         if type(endDate) == datetime
                         else endDate
                         if type(endDate) == int
                         else None
                     ),
                     (marks if marks != None else None),
                     (totalMarks if totalMarks != None else None),
                     weight,
                     False,
                     courseId,
                     int(time.mktime(datetime.utcnow().timetuple())*1000),
                     int(time.mktime(datetime.utcnow().timetuple())*1000),
                                                                   id))
        con.commit()
        return cur.execute(f'SELECT * FROM marks WHERE id = "{id}"').fetchone()
    # Get marks
    def query_marks(self,
                    select: tuple | str = "*",
                    filter: str | None = None,
                    order: str | None = None,
                    limit: int | None = None,
                    skip: int | None = None) -> sqlite3.Cursor:
        cur = con.cursor()
        q_string = f'SELECT {select if type(select) == str else ", ".join([x for x in select])} FROM marks'
        if filter:
            q_string = f'{q_string} WHERE {filter}'
        if order:
            q_string = f'{q_string} ORDER BY {order}'
        if limit:
            if limit >= 1:
                q_string = f'{q_string} LIMIT {limit}'
        if skip:
            if skip >= 1:
                q_string = f'{q_string} OFFSET {skip}'
        return cur.execute(q_string)
    # Update marks
    def update_marks(self,
                     update: dict,
                     filter: str,
                     order: str | None = None) -> sqlite3.Cursor:
        update = {**update, "updatedAt": time.mktime(datetime.utcnow().timetuple())*1000}
        if "endDate" in update.keys():
            courseId = marks.query_marks(select="courseId", filter=filter).fetchone()[0]
            (course_start, reading_week) = courses.query_courses(select=("start", "readingWeek"), filter=f'id="{courseId}"').fetchone()
            update = {**update, "week": 
                     math.ceil(((int(time.mktime(update["endDate"].timetuple())*1000)
                                 if type(update["endDate"]) == datetime
                                 else update["endDate"])-course_start)/(7*24*60*60*1000))}
            if reading_week and update["endDate"] > reading_week:
                update["week"] -= 1
        cur = con.cursor()
        q_string = f'UPDATE marks'
        q_string = f'{q_string} SET {", ".join([(k + " = " + "?") for k in update.keys()])}'
        q_string = f'{q_string} WHERE {filter}'
        if order:
            q_string = f'{q_string} ORDER BY {order}'
        cur.execute(q_string, [(None if update[k] in (-1, "$NULL") else update[k]) for k in update.keys()])
        con.commit()
        return cur.execute(f'SELECT * FROM marks WHERE {filter}').fetchall()
    # Delete marks
    def delete_marks(delf,
                     filter: str,
                     order: str | None = None) -> list:
        cur = con.cursor()
        q_string = f'DELETE FROM marks WHERE {filter}'
        if order:
            q_string = f'{q_string} ORDER BY {order}'
        data = cur.execute(f'SELECT * FROM marks WHERE {filter}').fetchall()
        try:
            return data
        finally:
            cur.execute(q_string)
            con.commit()

@dataclass
class MarkDataclass:
    name: str
    markType: str
    week: int | None
    startDate: int | None
    endDate: int
    marks: int | None
    totalMarks: int | None
    weight: float
    completed: bool
    courseId: str
    createdAt: int
    updatedAt: int
    id: str
    # Post init
    def __post_init__(self):
        self.completed = bool(self.completed)
    # To dict
    def to_dict(self):
        return asdict(self)

marks = Marks(fields=[
    SQLTextField(name="name", nullable=False),
    SQLTextField(name="markType", nullable=False, options=["ASSIGNMENT", "EXAM", "QUIZ", "TEST"]),
    SQLIntField(name="week", nullable=False, min=1),
    SQLIntField(name="startDate", min=0, default=None),
    SQLIntField(name="endDate", nullable=False, min=0),
    SQLFloatField(name="marks", min=0, default=None),
    SQLFloatField(name="totalMarks", min=1, default=None),
    SQLFloatField(name="weight", nullable=False, min=0, max=100),
    SQLBoolField(name="completed", nullable=False, default=False),
    SQLTextField(name="courseId", nullable=False),
    SQLIntField(name="createdAt", nullable=False, min=0),
    SQLIntField(name="updatedAt", nullable=False, min=0),
    SQLTextField(name="id", nullable=False, primary_key=True, unique=True)
])



class SQLDatabase:
    def __init__(self, connection: sqlite3.Connection, models: List[SQLTableBaseModel]):
        self.__connection__ = connection
        self.__models__ = models
    # Get connection
    def con(self) -> sqlite3.Connection:
        return self.__connection__
    # Get cursor
    def cur(self) -> sqlite3.Cursor:
        return self.con().cursor()
    # Get models
    def get_models(self) -> List[SQLTableBaseModel]:
        return self.__models__
    # Create
    def create_models(self):
        for model in self.get_models():
            model.create_if_not_exists()

db = SQLDatabase(connection=con,
                 models=[
                     courses,
                     marks
                 ])