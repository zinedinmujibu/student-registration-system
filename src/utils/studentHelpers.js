
export function getStudentStatistics(students) {
  const totalStudents = students.length;

  const maleStudents = students.filter(
    (student) => student.gender === "Male"
  ).length;

  const femaleStudents = students.filter(
    (student) => student.gender === "Female"
  ).length;

  const totalDepartments = new Set(
    students.map((student) => student.department)
  ).size;

  return {
    totalStudents,
    maleStudents,
    femaleStudents,
    totalDepartments,
  };
}
