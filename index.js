//1. get all students
// -> fetch students
//get students by ID

//*** 2. get all courses
//-> fetch courses
//get course by ID

//3. create new student (form with existing courses with checkbox)
//-> refetch students
//4. create new course (form with existing students with checkbox)
//-> refetch courses

//6. -> click course, go to new of it's course
// -> fetch all student's courses
// -> add new student to course (existing or create new)

//5. add student to course
//-> select existing or create new

//6. get student names per course
//7. remove student from course
//8. give grade to student course
//9. get average of grades in student per course


const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { request } = require("express");

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const students = [
  {
    name: "Test name 1",
    id: 1,
  },
  {
    name: "Test name 2",
    id: 2,
  },
  {
    name: "Test name 3",
    id: 3,
  },
  {
    name: "Test name 4",
    id: 4,
  },
  {
    name: "Test name 5",
    id: 5,
  },
];

const courses = [
  {
    id: 1,
    name: "frontend",
    students: [
      {
        id: 1,
        grades: [10, 9, 8, 10],
      },
      {
        id: 2,
        grades: [7, 9, 8, 10],
      },
      {
        id: 3,
        grades: [10, 9, 8, 4],
      },
    ],
  },
  {
    id: 2,
    name: "socialMedia",
    students: [
      {
        id: 5,
        grades: [6, 7, 8],
      },
      {
        id: 1,
        grades: [],
      },
    ],
  },
  {
    id: 3,
    name: "graphicDesign",
    students: [
      { id: 3, grades: [4, 4] },
      { id: 5, grades: [] },
      { id: 2, grades: [6, 6, 6] },
    ],
  },

  
];

function findCourse(id){
  for(let i = 0; i< courses.length; i++){
   if(courses[i].id == id){
     return courses[i];
   } 
  }
}

function findStudentByID(id){
  return students[id-1].name;
}
function findCourseNameByID(id){
  return courses[id-1].name;
}

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.get("/courses",(req,res)=>{
  res.json(courses);
})

app.get("/students",(req,res)=>{
  res.json(students);
})
app.post("/addNewStudent",(req,res)=>{
  const student = {
    id: students.length + 1,
    name: req.body.name,
  }

  const courseStudent = {
    id:student.id,
    grades:[]
  }

  const arr = {
    students: req.body.courses
  }

  courses.forEach((course)=>{
    if(arr.students.includes(course.id)){
      course.students.push(courseStudent);
    }
  })
  students.push(student);
  //console.log(students)
  res.json(student);
})

app.post("/students",(req,res)=>{
  console.log(req.body.id);
  const foundStudent = students.find((element)=>{
    if(element.id == req.body.id){
      return element
    }
  })
  res.json(foundStudent);
})

app.post("/course",(req,res)=>{
  //console.log(req.body.id);
  const foundCourse = courses.find((element)=>{
    if(element.id == req.body.id){
      return element
    }
  })
  res.json(foundCourse);
})

app.post("/studentName",(req,res)=>{
  const student = findStudentByID(req.body.id);
  res.json(student);
})

app.post("/studentsNotPartOfCourse",(req,res)=>{
  const studentIds = findCourse(req.body.id).students.map((element)=>element.id);
  const studentsNotPartOfCourse = students.forEach((student)=>{
    if(!studentIds.includes(student.id)){
      return student
    }
  })
  res.json("studentsNotPartOfCourse");
})

app.post("/courseWithStudentsByID",(req,res)=>{
  const foundCourse = findCourse(req.body.id);
  const courseStudents = foundCourse.students.map((element)=>{
    const obj = {
      id:element.id,
      name:findStudentByID(element.id),
      grades:element.grades
    }
    return obj;
  })
  console.log(courseStudents)
  const courseObj = {
    id: req.body.id,
    name: findCourseNameByID(req.body.id),
    students:courseStudents
  }
  res.json(courseObj);
})

app.post("/addNewCourse", (req, res) => {
  const studentsToAdd = req.body.students.map((element)=>{
    const student = {
      id: element,
      grades:[]
    }
    return student;
    })

  const course =   {
    id: courses.length + 1,
    name: req.body.courseName,
    students: studentsToAdd,
  }
  //console.log(course);
  
  courses.push(course);
  console.log(courses)
  res.json(course);
});

app.post("/getStudentCourses",(req,res)=>{
  const all = courses.filter((course)=>{
    if (course.students.find(e => e.id == req.body.id)) {
        return course
     }   
  })
  console.log(all)
  res.json(all)

})

app.post("/giveGradeToStudent",(req,res)=>{
 courses[req.body.courseId - 1].students.find((student)=>{
    if(student.id == req.body.studentId){
      student.grades.push(+req.body.grade);
    }
  })
  res.json(courses[req.body.courseId - 1]);
})

