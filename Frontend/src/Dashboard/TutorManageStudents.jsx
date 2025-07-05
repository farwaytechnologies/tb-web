import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/TutorManageStudents.css';

export default function TutorManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      const studentUsers = data.filter(user => user.role === 'student');
      setStudents(studentUsers);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="tutor-student-container">
      <h2>Students Enrolled in My Courses</h2>
      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="tutor-student-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Courses Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td className="tutor-student-avatar-cell">
                  <img
                    src={student.profilePic || '/default-profile.png'}
                    alt="Profile"
                    className="tutor-student-avatar"
                  />
                </td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.gender || 'N/A'}</td>
                <td>
                  {student.courses && student.courses.length > 0 ? (
                    <ul className="enrolled-course-list">
                      {student.courses.map((course, idx) => (
                        <li key={idx}>{course.title || course}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>No courses</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
