import { useEffect, useState } from 'react';
import './expenseForm.css';

const STORAGE_KEY = 'expense-tracker-mini-expenses';
const initialFormData = {
  eventName: '',
  eventDate: '',
  expenseType: 'photo',
  totalAmount: ''
};

const ExpenseForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    try {
      const savedExpenses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(savedExpenses)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExpenses(savedExpenses);
      }
    } catch (error) {
      console.error('Failed to load expenses', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  // handleSubmit: add a new expense or update an existing one when editingId is set.
  // - Validates trimmed name, date, type and positive numeric amount.
  // - If `editingId` is present, replaces the matching expense object.
  // - Otherwise, prepends a new expense object with a unique `id`.
  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = formData.eventName.trim();
    const amount = Number(formData.totalAmount);

    if (!trimmedName || !formData.eventDate || !formData.expenseType || Number.isNaN(amount) || amount <= 0) {
      alert('Please complete all fields with a valid amount.');
      return;
    }

    if (editingId) {
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === editingId
            ? { ...expense, eventName: trimmedName, eventDate: formData.eventDate, expenseType: formData.expenseType, totalAmount: amount }
            : expense
        )
      );
      setEditingId(null);
    } else {
      const newExpense = {
        id: Date.now(),
        eventName: trimmedName,
        eventDate: formData.eventDate,
        expenseType: formData.expenseType,
        totalAmount: amount
      };

      setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
    }

    setFormData(initialFormData);
  };

  // handleDelete: remove an expense by `id` and clear edit state if needed.
  // Note: the UI Delete button now asks the user to confirm before calling this.
  const handleDelete = (id) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setFormData(initialFormData);
    }
  };

  // handleEdit: populate the form with the selected expense and set `editingId`.
  // This puts the form into "edit mode" so submitting will update instead of create.
  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setFormData({
      eventName: expense.eventName,
      eventDate: expense.eventDate,
      expenseType: expense.expenseType,
      totalAmount: expense.totalAmount
    });
  };

  // filteredExpenses: apply searchTerm to eventName and expenseType (case-insensitive)
  const filteredExpenses = expenses.filter((expense) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return (
      expense.eventName.toLowerCase().includes(term) ||
      expense.expenseType.toLowerCase().includes(term)
    );
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.totalAmount, 0);

  return (
    <div className="expense-form-container">
      <form className="expense-form" onSubmit={handleSubmit}>
        <label>
          Event Name
          <input
            type="text"
            value={formData.eventName}
            onChange={(event) => setFormData({ ...formData, eventName: event.target.value })}
            placeholder="Enter event name"
          />
        </label>

        <label>
          Event Date
          <input
            type="date"
            value={formData.eventDate}
            onChange={(event) => setFormData({ ...formData, eventDate: event.target.value })}
          />
        </label>

        <label>
          Expense Type
          <select
            value={formData.expenseType}
            onChange={(event) => setFormData({ ...formData, expenseType: event.target.value })}
          >
            <option value="photo">Photo</option>
            <option value="p-v">Photo & Video</option>
            <option value="p+v+e">Photo, Video & Events</option>
          </select>
        </label>

        <label>
          Total Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.totalAmount}
            onChange={(event) => setFormData({ ...formData, totalAmount: event.target.value })}
            placeholder="Enter total amount"
          />
        </label>

        <button type="submit">{editingId ? 'Save Changes' : 'Add Expense'}</button>
      </form>

      <div className="expense-panel">
        <div className="expense-toolbar">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by event or type"
          />
          <div className="summary-card">
            <span>Total Expenses</span>
            <strong>Rs.{totalExpenses.toFixed(2)}</strong>
          </div>
        </div>

        <div className="expense-list">
          {filteredExpenses.length > 0 ? (
              // {/* Expense list: maps `filteredExpenses` to UI cards with formatted date/amount and actions. */}
              filteredExpenses.map((expense) => (
                <div key={expense.id} className="expense-item">
                <div>
                  <h3>{expense.eventName}</h3>
                  <p>{new Date(expense.eventDate).toLocaleDateString()}</p>
                  <p>{expense.expenseType}</p>
                </div>
                <div className="expense-actions">
                  <strong>Rs.{expense.totalAmount.toFixed(2)}</strong>
                  <button
                    type="button"
                    onClick={() => handleEdit(expense)}
                    aria-label={`Edit ${expense.eventName}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this expense?')) handleDelete(expense.id);
                    }}
                    aria-label={`Delete ${expense.eventName}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">No expenses found for this search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
