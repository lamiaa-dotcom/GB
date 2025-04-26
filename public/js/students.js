const API_URL = 'http://localhost:3000/api/students'; // Replace with Azure URL for deployment

// Load students on page load
document.addEventListener('DOMContentLoaded', loadStudents);

// Create student
document.getElementById('studentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const student = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    studentId: document.getElementById('studentId').value,
    email: document.getElementById('email').value,
  };
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    loadStudents();
    document.getElementById('studentForm').reset();
  } catch (error) {
    alert('Error creating student: ' + error.message);
  }
});

// Load students
async function loadStudents() {
  try {
    const response = await fetch(API_URL);
    const students = await response.json();
    const tableBody = document.getElementById('studentsTable');
    tableBody.innerHTML = '';
    students.forEach((student) => {
      const row = `
        <tr>
          <td>${student.firstName}</td>
          <td>${student.lastName}</td>
          <td>${student.studentId}</td>
          <td>${student.email}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="openUpdateModal('${student._id}', '${student.firstName}', '${student.lastName}', '${student.studentId}', '${student.email}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student._id}')">Delete</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    alert('Error loading students: ' + error.message);
  }
}

// Open update modal
function openUpdateModal(id, firstName, lastName, studentId, email) {
  document.getElementById('updateStudentId').value = id;
  document.getElementById('updateFirstName').value = firstName;
  document.getElementById('updateLastName').value = lastName;
  document.getElementById('updateStudentId').value = studentId;
  document.getElementById('updateEmail').value = email;
  new bootstrap.Modal(document.getElementById('updateStudentModal')).show();
}

// Update student
document.getElementById('updateStudentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('updateStudentId').value;
  const student = {
    firstName: document.getElementById('updateFirstName').value,
    lastName: document.getElementById('updateLastName').value,
    studentId: document.getElementById('updateStudentId').value,
    email: document.getElementById('updateEmail').value,
  };
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    loadStudents();
    bootstrap.Modal.getInstance(document.getElementById('updateStudentModal')).hide();
  } catch (error) {
    alert('Error updating student: ' + error.message);
  }
});

// Delete student
async function deleteStudent(id) {
  if (confirm('Are you sure you want to delete this student?')) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      loadStudents();
    } catch (error) {
      alert('Error deleting student: ' + error.message);
    }
  }
}