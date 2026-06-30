// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';

const initialForm = { name: '', age: '', dob: '', className: '' };

const StudentForm = () => {
  const [form, setForm] = useState(initialForm);
  const [students, setStudents] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

// handleEdit: populate the form (including id) so the form enters "edit mode"
  const handleEdit = (s) => {
    const studentToEdit = students.find((student) => student.id === s.id);
    if (studentToEdit) {
      setForm({
        id: studentToEdit.id,
        name: studentToEdit.name,
        age: studentToEdit.age,
        dob: studentToEdit.dob,
        className: studentToEdit.className,
      });
    }
  };
            

  // handleSubmit: create a new student or update existing one when form.id is present
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.name.trim()) return;

    if (form.id) {
      // update existing student
      setStudents((prev) =>
        prev.map((st) =>
          st.id === form.id
            ? { ...st, name: form.name.trim(), age: form.age, dob: form.dob, className: form.className }
            : st
        )
      );
    } else {
      // add new student
      setStudents((prev) => [...prev, { ...form, id: Date.now() }]);
    }

    // reset form back to initial state (exit edit mode)
    setForm(initialForm);
  };

//   console.log('Students:', students);
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <h2>{form.id ? 'Edit Student' : 'Add Student'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} />
        </label>

        <label>
          Age
          <input name="age" value={form.age} onChange={handleChange} />
        </label>

        <label>
          Date of Birth
          <input type="date" name="dob" value={form.dob} onChange={handleChange} />
        </label>

        <label>
          Class
          <input name="className" value={form.className} onChange={handleChange} />
        </label>

        <div>
          <button type="submit">{form.id ? 'Update Student' : 'Add Student'}</button>
        </div>
      </form>

      <h3 style={{ marginTop: 24 }}>Students</h3>
      {students.length === 0 ? (
        <p>No students yet.</p>
      ) : (
        <ul>
          {students.map((s) => (
            <li key={s.id} style={{ marginBottom: 8 }}>
              <strong>{s.name}</strong> — Age: {s.age} — DOB: {s.dob} — Class: {s.className} 
              <button onClick={() => handleEdit(s)} aria-label={`Edit ${s.name}`}>
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Delete this student?')) {
                    setStudents((prev) => prev.filter((student) => student.id !== s.id));
                  }
                }}
                style={{ marginLeft: 8 }}
                aria-label={`Delete ${s.name}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentForm;
