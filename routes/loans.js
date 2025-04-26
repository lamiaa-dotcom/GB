const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const Book = require('../models/Book');

// Borrow a book
router.post('/borrow', async (req, res) => {
  const { bookId, studentId, dueDate } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book || book.available <= 0) {
      return res.status(400).json({ error: 'Book not available' });
    }

    const loan = new Loan({ bookId, studentId, dueDate });
    await loan.save();

    book.available -= 1;
    await book.save();

    res.status(201).json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Return a book
router.put('/return/:id', async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    if (loan.status === 'returned') {
      return res.status(400).json({ error: 'Book already returned' });
    }

    loan.status = 'returned';
    loan.returnDate = new Date();
    await loan.save();

    const book = await Book.findById(loan.bookId);
    book.available += 1;
    await book.save();

    res.json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get active loans
router.get('/active', async (req, res) => {
  try {
    const loans = await Loan.find({ status: 'active' }).populate('bookId studentId');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;