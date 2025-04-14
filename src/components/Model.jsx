import { useState } from "react";
function Modal({ onClose, onSubmit }) {
  const [title, settitle] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState('0')
  const [type, setType] = useState('Debited')

  const fetchinfo = () => {
    if(title.length>2 && date.length!=0 && amount>0){
      const data = { title, date, amount, type };
      //to send data to the parent we will use onsubmit --> which we have passed here as a props
      onSubmit(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
        <h2 className="text-xl mb-4">Enter Details</h2>
        <input onChange={(e) => { settitle(e.target.value) }} value={title} type="text" placeholder="Where You Spend money or get money" className="border p-2 w-full mb-4" />
        <input onChange={(e) => { setAmount(e.target.value) }} value={amount} type="Number" placeholder="Enter the amount" className="border p-2 w-full mb-4" />
        <input onChange={(e) => { setDate(e.target.value) }} value={date} type="Date" placeholder="date" className="border p-2 w-full mb-4" />
        <select onChange={(e) => { setType(e.target.value) }} value={type} className="border p-2 w-full mb-4">
          <option value="Debited">Debited</option>
          <option value="Credited">Credited</option>
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={() => { fetchinfo()}} className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        </div>
      </div>
    </div>
  );
}


export default Modal;