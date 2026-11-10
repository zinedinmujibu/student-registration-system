import { getStudentStatistics } from "../utils/studentHelpers";
function StudentStats({ students }) {
  const {
  totalStudents,
  maleStudents,
  femaleStudents,
  totalDepartments,
} = getStudentStatistics(students);

  // Count students and calculate percentages
  const departmentStats = [
    "Computer Science",
    "Information Technology",
    "Software Engineering",
    "Information Systems",
    "Electrical Engineering",
  ].map((department) => {
    const count = students.filter(
      (student) => student.department === department
    ).length;

    const percentage =
      students.length === 0
        ? 0
        : (count / students.length) * 100;

    return {
      department,
      count,
      percentage,
    };
  });

  return (
    <section className="stats-container">
      <h2>Student Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{totalStudents}</p>
        </div>

        <div className="stat-card">
          <h3>Male Students</h3>
          <p>{maleStudents}</p>
        </div>

        <div className="stat-card">
          <h3>Female Students</h3>
          <p>{femaleStudents}</p>
        </div>

        <div className="stat-card">
          <h3>Departments</h3>
          <p>{totalDepartments}</p>
        </div>
      </div>

      <h2 className="department-title">
        Students by Department
      </h2>

      <div className="department-stats">
        {departmentStats.map((item) => (
          <div
            className="department-card"
            key={item.department}
          >
            <h3>{item.department}</h3>

            <p>{item.count} Students</p>

            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${item.percentage}%`,
                }}
              ></div>
            </div>

            <small>{item.percentage.toFixed(1)}%</small>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StudentStats;
