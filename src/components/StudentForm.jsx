
import { useEffect, useState } from "react";

const initialFormData = {
  fullName: "",
  studentId: "",
  gender: "",
  department: "",
  courses: [],
};

function StudentForm({
  onAddStudent,
  studentToEdit,
  onUpdateStudent,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const coursesList = [
    "Web Development",
    "Database Systems",
    "Computer Networks",
    "Artificial Intelligence",
    "Software Engineering",
  ];

  // Fill the form when editing a student
  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        fullName: studentToEdit.fullName,
        studentId: studentToEdit.studentId,
        gender: studentToEdit.gender,
        department: studentToEdit.department,
        courses: [...studentToEdit.courses],
      });
    } else {
      setFormData(initialFormData);
    }

    setErrors({});
  }, [studentToEdit]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  }

  function handleCourseChange(event) {
    const { value, checked } = event.target;

    setFormData((previousData) => {
      const updatedCourses = checked
        ? [...previousData.courses, value]
        : previousData.courses.filter(
            (course) => course !== value
          );

      return {
        ...previousData,
        courses: updatedCourses,
      };
    });

    setErrors((previousErrors) => ({
      ...previousErrors,
      courses: "",
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};
    const name = formData.fullName.trim();
    const studentId = formData.studentId.trim();

    if (!name) {
      newErrors.fullName = "Full name is required.";
    } else if (!/^[A-Za-z ]+$/.test(name)) {
      newErrors.fullName = "Use letters and spaces only.";
    }

    if (!studentId) {
      newErrors.studentId = "Student ID is required.";
    } else if (!/^[0-9/]+$/.test(studentId)) {
      newErrors.studentId = "Use numbers and / only.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender.";
    }

    if (!formData.department) {
      newErrors.department = "Please select a department.";
    }

    if (formData.courses.length === 0) {
      newErrors.courses = "Select at least one course.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const studentData = {
      ...formData,
      fullName: name,
      studentId,
    };

    const result = studentToEdit
      ? onUpdateStudent({
          ...studentData,
          id: studentToEdit.id,
        })
      : onAddStudent(studentData);

    if (result) {
      setErrors({ studentId: result });
      return;
    }

    alert(
      studentToEdit
        ? "Student updated successfully!"
        : "Student registered successfully!"
    );

    setFormData(initialFormData);
    setErrors({});
  }

  function handleCancel() {
    setFormData(initialFormData);
    setErrors({});
    onCancelEdit();
  }

  return (
    <section className="form-section">
      <h2>
        {studentToEdit
          ? "Edit Student Information"
          : "Register New Student"}
      </h2>

      <p className="section-description">
        {studentToEdit
          ? "Update the student's information below."
          : "Enter the student information below."}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>

          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) => {
  const value = e.target.value;

  if (/^[\p{L}\s]*$/u.test(value)) {
    setFormData({
      ...formData,
      fullName: value,
    });
  }
}}
          />

          {errors.fullName && (
            <p className="error-message">{errors.fullName}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="studentId">Student ID</label>

          <input
            type="text"
            id="studentId"
            name="studentId"
            placeholder="Example: 2024/123"
            value={formData.studentId}
            onChange={(e) => {
  const value = e.target.value;

  if (/^[0-9/]*$/.test(value)) {
    setFormData({
      ...formData,
      studentId: value,
    });
  }
}}
          />

          {errors.studentId && (
            <p className="error-message">{errors.studentId}</p>
          )}
        </div>

        <div className="form-group">
          <label>Gender</label>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
              />
              Male
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
              />
              Female
            </label>
          </div>

          {errors.gender && (
            <p className="error-message">{errors.gender}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>

          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">
              Information Technology
            </option>
            <option value="Software Engineering">
              Software Engineering
            </option>
            <option value="Information Systems">
              Information Systems
            </option>
            <option value="Electrical Engineering">
              Electrical Engineering
            </option>
          </select>

          {errors.department && (
            <p className="error-message">{errors.department}</p>
          )}
        </div>

        <div className="form-group">
          <label>Courses</label>

          <div className="courses-list">
            {coursesList.map((course) => (
              <label key={course} className="course-option">
                <input
                  type="checkbox"
                  value={course}
                  checked={formData.courses.includes(course)}
                  onChange={handleCourseChange}
                />
                {course}
              </label>
            ))}
          </div>

          {errors.courses && (
            <p className="error-message">{errors.courses}</p>
          )}
        </div>

        <button type="submit" className="register-button">
          {studentToEdit ? "Update Student" : "Register Student"}
        </button>

        {studentToEdit && (
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel Edit
          </button>
        )}
      </form>
    </section>
  );
}

export default StudentForm;
