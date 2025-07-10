import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [studentsCount, setStudentsCount] = useState()
  const [facultiesCount, setFacultiesCount] = useState()
  const [studentsPresent, setStudentsPresent] = useState()
  const [studentsAbsent, setStudentsAbsent] = useState()
  const [facultiesPresent, setFacultiessPresent] = useState()
  const [facultiesAbsent, setFacultiessAbsent] = useState()

  useEffect(() => {
    axios.get('/api/v1/students')
      .then((res) => {
        console.log("res", res)
        setStudentsCount(res.data.students.count)
        setStudentsPresent(res.data.students.present)
        setStudentsAbsent(res.data.students.absent)
      })
      .catch((err) => { console.log("err", err) })
    axios.get('/api/v1/faculties')
      .then((res) => {
        console.log("res", res)
        setFacultiesCount(res.data.faculties.count)
        setFacultiessPresent(res.data.faculties.present)
        setFacultiessAbsent(res.data.faculties.absent)
      })
      .catch((err) => { console.log("err", err) })
  }, [])

  return (<>
    <h1>Attendance</h1>
    <div className="cols">
      <div className="col col-1">
        <h2>Students</h2>
        <div className="col-data">
          <p>Count: <span>{studentsCount}</span></p>
          <p>Present: <span>{studentsPresent}</span></p>
          <p>Absent: <span>{studentsAbsent}</span></p>
        </div>
      </div>
      <div className="col col-2">
        <h2>Faculties</h2>
        <div className="col-data">
          <p>Count: <span>{facultiesCount}</span></p>
          <p>Present: <span>{facultiesPresent}</span></p>
          <p>Absent: <span>{facultiesAbsent}</span></p>
        </div>
      </div>
    </div>
  </>
  );
}

export default App;
