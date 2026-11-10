
import { useEffect, useState } from "react";
import Header from "./components/Header";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import StudentDetails from "./components/StudentDetails";
import StudentStats from "./components/StudentStats";

const STORAGE_KEY = "student-registration-form.students.v1";

function App() {
  const [students, setStudents] = useState(() => {
    try {
      const savedStudents = localStorage.getItem(STORAGE_KEY);
      return savedStudents ? JSON.parse(savedStudents) : [];
    } catch (error) {
      console.error("Could not load students:", error);
      return [];
    }
  });

  const [studentToEdit, setStudentToEdit] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (error) {
      console.error("Could not save students:", error);
    }
  }, [students]);

  // Add a new student
  function addStudent(newStudent) {
    const duplicate = students.some(
      (student) =>
        student.studentId.trim() === newStudent.studentId.trim()
    );

    if (duplicate) {
      return "This Student ID is already registered.";
    }

    const studentWithId = {
      ...newStudent,
      id: crypto.randomUUID(),
    };

    setStudents((previousStudents) => [
      ...previousStudents,
      studentWithId,
    ]);

    return null;
  }

  // Update an existing student
  function updateStudent(updatedStudent) {
    const duplicate = students.some(
      (student) =>
        student.id !== updatedStudent.id &&
        student.studentId.trim() === updatedStudent.studentId.trim()
    );

    if (duplicate) {
      return "This Student ID belongs to another student.";
    }

    setStudents((previousStudents) =>
      previousStudents.map((student) =>
        student.id === updatedStudent.id
          ? updatedStudent
          : student
      )
    );

    setStudentToEdit(null);
    return null;
  }

  // Delete a student
  function deleteStudent(studentId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    setStudents((previousStudents) =>
      previousStudents.filter(
        (student) => student.id !== studentId
      )
    );

    if (studentToEdit?.id === studentId) {
      setStudentToEdit(null);
    }
  }
  function clearAllStudents() {
  if (students.length === 0) {
    alert("There are no students to clear.");
    return;
  }

  const confirmClear = window.confirm(
    "Are you sure you want to delete ALL students?"
  );

  if (!confirmClear) return;

  setStudents([]);
  setStudentToEdit(null);
}
function exportStudents() {
  if (students.length === 0) {
    alert("There are no student records to export.");
    return;
  }

  const jsonData = JSON.stringify(students, null, 2);

  const blob = new Blob([jsonData], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "student-records.json";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
function importStudents(event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const importedStudents = JSON.parse(e.target.result);

      // Check whether the JSON contains an array
      if (!Array.isArray(importedStudents)) {
        alert("Invalid file! Student records must be an array.");
        return;
      }

      const existingIds = new Set(
        students.map((student) => student.studentId.trim())
      );

      const importedIds = new Set();

      const validStudents = importedStudents.filter((student) => {
        // Check the student object
        if (
          !student ||
          typeof student !== "object" ||
          Array.isArray(student)
        ) {
          return false;
        }

        // Check required fields
        if (
          typeof student.fullName !== "string" ||
          typeof student.studentId !== "string" ||
          typeof student.gender !== "string" ||
          typeof student.department !== "string" ||
          !Array.isArray(student.courses)
        ) {
          return false;
        }

        const fullName = student.fullName.trim();
        const studentId = student.studentId.trim();

        // Validate full name
        if (!/^[\p{L}\s]+$/u.test(fullName)) {
          return false;
        }

        // Validate Student ID
        if (!/^\d+(?:\/\d+)*$/.test(studentId)) {
          return false;
        }

        // Validate other required fields
        if (
          !student.gender.trim() ||
          !student.department.trim() ||
          student.courses.length === 0 ||
          !student.courses.every(
            (course) =>
              typeof course === "string" && course.trim() !== ""
          )
        ) {
          return false;
        }

        // Prevent duplicate IDs
        if (
          existingIds.has(studentId) ||
          importedIds.has(studentId)
        ) {
          return false;
        }

        importedIds.add(studentId);

        return true;
      });

      // Generate new internal IDs
      const studentsWithIds = validStudents.map((student) => ({
        ...student,
        id: crypto.randomUUID(),
      }));

      setStudents((previousStudents) => [
        ...previousStudents,
        ...studentsWithIds,
      ]);

      const skipped = importedStudents.length - studentsWithIds.length;

      alert(
        `Import completed!\n\n` +
        `Imported: ${studentsWithIds.length}\n` +
        `Skipped: ${skipped}`
      );
    } catch (error) {
      alert("Invalid JSON file. Please select a valid backup.");
    }

    event.target.value = "";
  };

  reader.readAsText(file);
}
function goBackToStudents() {
  setSelectedStudent(null);
}

  return (
  <>
    <Header />

    <main>
      {selectedStudent ? (
        <StudentDetails
          student={selectedStudent}
          onBack={goBackToStudents}
        />
      ) : (
        <>
<StudentStats students={students} />

          <StudentForm
            onAddStudent={addStudent}
            studentToEdit={studentToEdit}
            onUpdateStudent={updateStudent}
            onCancelEdit={() => setStudentToEdit(null)}
          />
          <StudentList
  students={students}
  onDeleteStudent={deleteStudent}
  onEditStudent={setStudentToEdit}
  onClearAll={clearAllStudents}
  onExport={exportStudents}
  onViewStudent={setSelectedStudent}
  onImport={importStudents}
/>
        </>
      )}
    </main>
  </>
)};
export default App;