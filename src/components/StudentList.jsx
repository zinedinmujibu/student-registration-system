
import { useState } from "react";

function StudentList({
  students,
  onDeleteStudent,
  onEditStudent,
  onClearAll,
  onExport,
  onViewStudent,
  onImport,
})   {
  const [searchTerm, setSearchTerm] = useState("");

  // Search students by name, ID, or department
  const sortedStudents = [...students].sort((a, b) =>
  a.fullName.localeCompare(b.fullName, undefined, {
    sensitivity: "base",
  })
);

const filteredStudents = sortedStudents.filter((student) => {
  return (
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
});
  

  return (
    <section className="form-section">
      <h2>Registered Students</h2>
      <button
  type="button"
  className="clear-all-button"
  onClick={onClearAll}
  disabled={students.length === 0}
>
  Clear All Students
</button>
<button
  type="button"
  className="export-button"
  onClick={onExport}
  disabled={students.length === 0}
>
  Export JSON
</button>
<label className="import-button">
  Import JSON
  <input
    type="file"
    accept=".json,application/json"
    onChange={onImport}
    hidden
  />
</label>

      <p className="section-description">
        Total Registered Students: {students.length}
      </p>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, ID, or department..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <p className="empty-message">
          {students.length === 0
            ? "No students registered yet."
            : "No matching students found."}
        </p>
      ) : (
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Student ID</th>
                <th>Gender</th>
                <th>Department</th>
                <th>Courses</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.fullName}</td>
                  <td>{student.studentId}</td>
                  <td>{student.gender}</td>
                  <td>{student.department}</td>
                  <td>{student.courses.join(", ")}</td>

                  {/* Edit and Delete Buttons */}
                  <td>
                    <button
  type="button"
  className="view-button"
  onClick={() => onViewStudent(student)}
>
  View Details
</button>
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => onEditStudent(student)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => onDeleteStudent(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default StudentList;
