function StudentDetails({ student, onBack }) {
  return (
    <div className="student-details">
      <h2>Student Details</h2>

      <div className="details-card">
        <p>
          <strong>Full Name:</strong> {student.fullName}
        </p>

        <p>
          <strong>Student ID:</strong> {student.studentId}
        </p>

        <p>
          <strong>Gender:</strong> {student.gender}
        </p>

        <p>
          <strong>Department:</strong> {student.department}
        </p>

        <div>
          <strong>Courses:</strong>

          <ul>
            {student.courses.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        Back to Students
      </button>
    </div>
  );
}

export default StudentDetails;