const API_URL = 'http://localhost:3000/api/loans'; // Replace with Azure URL for deployment
const BOOKS_API = 'http://localhost:3000/api/books';
const STUDENTS_API = 'http://localhost:3000/api/students';

// Load loans, books, and students on page load
document.addEventListener('DOMContentLoaded', () => {
  loadLoans();
  loadBooksForDropdown();
  loadStudentsForDropdown();
});

// Create loan
document.getElementById('loanForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const loan = {
    bookId: document.getElementById('bookId').value,
    studentId: document.getElementById('studentId').value,
    dueDate: document.getElementById('dueDate').value,
  };
  try {
    await fetch(`${API_URL}/borrow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loan),
    });
    loadLoans();
    document.getElementById('loanForm').reset();
  } catch (error) {
    alert('Error creating loan: ' + error.message);
  }
});

// Load loans
async function loadLoans() {
  try {
    const response = await fetch(`${API_URL}/active`);
    const loans = await response.json();
    const tableBody = document.getElementById('loansTable');
    tableBody.innerHTML = '';
    loans.forEach((loan) => {
      const row = `
        <tr>
          <td>${loan.bookId.title}</td>
          <td>${loan.studentId.firstName} ${loan.studentId.lastName}</td>
          <td>${new Date(loan.loanDate).toLocaleDateString()}</td>
          <td>${new Date(loan.dueDate).toLocaleDateString()}</td>
          <td>${loan.status}</td>
          <td>
            <button class="btn btn-sm btn-success" onclick="returnBook('${loan._id}')">Return</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    alert('Error loading loans: ' + error.message);
  }
}

// Load books for dropdown
async function loadBooksForDropdown() {
  try {
    const response = await fetch(BOOKS_API);
    const books = await response.json();
    const bookSelect = document.getElementById('bookId');
    bookSelect.innerHTML = '<option value="" disabled selected>Select a book</option>';
    books.forEach((book) => {
      if (book.available > 0) {
        bookSelect.innerHTML += `<option value="${book._id}">${book.title}</option>`;
      }
    });
  } catch (error) {
    alert('Error loading books: ' + error.message);
  }
}

// Load students for dropdown
async function loadStudentsForDropdown() {
  try {
    const response = await fetch(STUDENTS_API);
    const students = await response.json();
    const studentSelect = document.getElementById('studentId');
    studentSelect.innerHTML = '<option value="" disabled selected>Select a student</option>';
    students.forEach((student) => {
      studentSelect.innerHTML += `<option value="${student._id}">${student.firstName} ${student.lastName}</option>`;
    });
  } catch (error) {
    alert('Error loading students: ' + error.message);
  }
}

// Return book
async function returnBook(id) {
  if (confirm('Are you sure you want to return this book?')) {
    try {
      await fetch(`${API_URL}/return/${id}`, { method: 'PUT' });
      loadLoans();
    } catch (error) {
      alert('Error returning book: ' + error.message);
    }
  }
}