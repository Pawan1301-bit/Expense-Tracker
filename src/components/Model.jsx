import { useState } from "react";

function Modal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState('0');
  const [type, setType] = useState('Debited');

  const fetchinfo = () => {
    if (title.length > 2 && date.length !== 0 && amount > 0) {
      const data = { title, date, amount, type };
      onSubmit(data);
      onClose();
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add Transaction</h2>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 py-4 space-y-4">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input 
              id="title"
              onChange={(e) => { setTitle(e.target.value) }} 
              value={title} 
              type="text" 
              placeholder="Where you spent or received money" 
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base" 
            />
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹)
            </label>
            <input 
              id="amount"
              onChange={(e) => { setAmount(e.target.value) }} 
              value={amount} 
              type="number" 
              min="0"
              step="0.01"
              placeholder="Enter the amount" 
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base" 
            />
          </div>

          {/* Date Input */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input 
              id="date"
              onChange={(e) => { setDate(e.target.value) }} 
              value={date} 
              type="date" 
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base" 
            />
          </div>

          {/* Type Select */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <select 
              id="type"
              onChange={(e) => { setType(e.target.value) }} 
              value={type} 
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base bg-white"
            >
              <option value="Debited">Debited (Expense)</option>
              <option value="Credited">Credited (Income)</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
            <button 
              onClick={onClose} 
              className="w-full sm:w-auto px-4 py-2 sm:py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium text-sm sm:text-base order-2 sm:order-1"
            >
              Cancel
            </button>
            <button 
              onClick={() => { fetchinfo() }} 
              className="w-full sm:w-auto px-4 py-2 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm sm:text-base order-1 sm:order-2"
            >
              Add Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;