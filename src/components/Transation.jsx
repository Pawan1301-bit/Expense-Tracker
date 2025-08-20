import { useState, useEffect } from 'react';
import Modal from './Model';
import { v4 as uuidv4 } from 'uuid';
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import { FaSortAmountDown } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



const Transaction = () => {
    const [showModal, setShowModal] = useState(false);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const navigate = useNavigate();

    // Fixed processdate function - now validates if date is provided
    function processDate(dateInput) {
        if (!dateInput) {
            toast.error("Please provide a valid date");
            return false;
        }
        // Add any additional date validation logic here if needed
        return true;
    }

    
    const addTransaction = async (data) => {
        // Validate the data
        if (!data.title || !data.amount || !data.type || !data.date) {
            toast.error("Please fill all required fields");
            return;
        }

        const newTrans = {
            ...data,
            _id: uuidv4(),
            amount: parseFloat(data.amount), // Ensure amount is a number
        };
        
        console.log(data);
        
        if (processDate(data.date)) {
            const updatedHistory = [...transactionHistory, newTrans];
            setTransactionHistory(updatedHistory);

            // Update total amount
            let updatedAmount = totalAmount;
            if (data.type === 'Debited') {
                updatedAmount -= parseFloat(data.amount);
            } else if (data.type === 'Credited') {
                updatedAmount += parseFloat(data.amount);
            }
            setTotalAmount(updatedAmount);

            // Save to localStorage
            // localStorage.setItem('expense-history', JSON.stringify(updatedHistory));
            localStorage.setItem('expense-total', updatedAmount.toString());
            
            // Close modal and show success message
            setShowModal(false);
            toast.success("Transaction added successfully!");

            //so the task now is to send data to the  backend using post request
            try {
                const response = await fetch('http://localhost:3000/transaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
            })
                const result = await response.json();
                console.log(`server respones : ${result}`);

            } catch (error) {
                console.error("Error adding transaction:", error);
                toast.error("Failed to add transaction to database.");
            }

        }
    };

    const handleDelete = async (id) => {

        console.log(id);
        const response = await fetch(`http://localhost:3000/transactions/${id}`, {
            method: 'Delete'
        });

        const data = await response.json();

        if(response.ok){
            const {amount , type} = data;
            let newamount = totalAmount ;
            if(type === "Debited"){
                newamount += amount;
            }else{  
                newamount -= amount;
            }
            setTotalAmount(newamount);
            localStorage.setItem('expense-total', newamount.toString());
            toast.error("Transaction Deleted");
        }else{
            console.log(`deletioin of transaction failed : ${response.message}`);
            toast.error("failed Deleting transaction");
        }};

    const deleteAll = () => {
        const pin = prompt("Enter the PIN to delete all transactions:");
        if (pin === "1000") {
            setTotalAmount(0);
            localStorage.removeItem('expense-total');
            toast.success("All transactions cleared!");
        } else if (pin !== null) {
            toast.error("Invalid PIN!");
        }
    };

       

        //here we will fetch and display the transactions 
    useEffect(() => {   
        const savedAmount = parseFloat(localStorage.getItem('expense-total')) || 0;
        setTotalAmount(savedAmount);
        fetch(`http://localhost:3000/transactions`)
        .then(response => response.json())
        .then (data => { setTransactionHistory(data) })
        .catch(error => console.error(`error fetching transaction : ${error}'`))
        
    }, [transactionHistory])  //it will display after every adding , deleting etc

    return (
        <>
            <div className=''>
                <h3 className='font-bold text-2xl sm:text-3xl lg:text-4xl px-4 sm:px-8 lg:px-16 py-4 sm:py-6 lg:py-8'>Dashboard</h3>
                <div className='flex justify-center px-4'>
                    <div className='text-center h-auto min-h-[80px] w-full max-w-4xl bg-black rounded-2xl lg:rounded-3xl text-white font-bold text-lg sm:text-xl lg:text-3xl py-4 sm:py-6 lg:py-7 px-4'>
                        Total Amount: ₹{totalAmount.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className='p-2 w-full max-w-6xl mx-auto mt-4 sm:mt-6 flex justify-center px-4'>
                <div className='min-h-[50vh] w-full bg-slate-200 p-3 sm:p-4 rounded-lg'>
                    <div className='text-lg sm:text-xl p-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <span className='text-lg sm:text-xl font-bold'>Transaction History</span>
                        <span className='flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm sm:text-lg w-full sm:w-auto'>
                            <button 
                                onClick={deleteAll} 
                                className='flex border-black border-2 py-2 sm:py-0.5 px-3 sm:px-2 rounded-3xl w-full sm:w-40 items-center justify-center hover:bg-red-100 text-sm sm:text-base'
                            >
                                Reset amount
                                <span className='ml-1'>
                                    <MdDeleteForever />
                                </span>
                            </button>
                            <button onClick={() => navigate("/Analysize")}
                                // onClick={sortHistory} 
                                className='flex border-black border-2 py-2 sm:py-0.5 px-3 sm:px-2 rounded-3xl w-full sm:w-auto items-center justify-center hover:bg-blue-200 text-sm sm:text-base'
                            >
                                Analysize 
                                <span className='ml-1'>
                                    <BsGraphUpArrow />
                                </span>
                            </button>
                            <div>
                                <input type="text" 
                                placeholder='search transaction' 
                                className='px-1 py-2 border-black border-2 rounded-3xl text-sm mx-1'
                                onChange={(e)=>{e.target.value}}/>
                                <button className='my-2'
                                 ><FaSearch /></button>
                            </div>
                        </span>
                    </div>

                    {transactionHistory.length === 0 ? (
                        <div className='text-center py-8 text-gray-500 text-sm sm:text-base'>
                            No transactions yet.
                        </div>
                    ) : (
                        <div className='overflow-x-auto'>
                            {/* Desktop Table View */}
                            <div className='hidden sm:block'>
                                <table className="table-auto w-full overflow-hidden rounded-lg bg-white">
                                    <thead className='bg-gray-50'>
                                        <tr>
                                            <th className='text-center py-3 px-2 font-semibold text-sm lg:text-base'>Date</th>
                                            <th className='text-center py-3 px-2 font-semibold text-sm lg:text-base'>Description</th>
                                            <th className='text-center py-3 px-2 font-semibold text-sm lg:text-base'>Amount</th>
                                            <th className='text-center py-3 px-2 font-semibold text-sm lg:text-base'>Type</th>
                                            <th className='text-center py-3 px-2 font-semibold text-sm lg:text-base'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-200'>
                                        {transactionHistory.map((item) => {
                                            return (
                                                <tr key={item._id} className='hover:bg-gray-50'>
                                                    <td className='text-center py-3 px-2 text-sm lg:text-base'>{item.date.slice(0, 10)}</td>
                                                    <td className='text-center py-3 px-2 text-sm lg:text-base break-words'>{item.title}</td>
                                                    <td className='text-center py-3 px-2 font-semibold text-sm lg:text-base'>
                                                        {item.type === 'Debited' ? 
                                                            <span className='text-red-600'>-₹{parseFloat(item.amount).toFixed(2)}</span> : 
                                                            <span className='text-green-600'>+₹{parseFloat(item.amount).toFixed(2)}</span>
                                                        }
                                                    </td>
                                                    <td className='text-center py-3 px-2'>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            item.type === 'Debited' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                            {item.type}
                                                        </span>
                                                    </td>
                                                    <td className='text-center py-3 px-2'>
                                                        <button 
                                                            onClick={() => handleDelete(item._id)}
                                                            className='text-red-600 hover:text-red-800 hover:bg-red-100 p-1 rounded'
                                                            title="Delete Transaction"
                                                        >
                                                            <MdDeleteForever size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className='block sm:hidden space-y-3'>
                                {transactionHistory.map((item) => (
                                    <div key={item._id} className='bg-white rounded-lg p-4 shadow-sm border border-gray-200'>
                                        <div className='flex justify-between items-start mb-2'>
                                            <div className='flex-1'>
                                                <h4 className='font-semibold text-base text-gray-800 break-words'>{item.title}</h4>
                                                <p className='text-sm text-gray-500 mt-1'>{item.date.slice(0, 10)}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(item._id)}
                                                className='text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded ml-2'
                                                title="Delete Transaction"
                                            >
                                                <MdDeleteForever size={20} />
                                            </button>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                item.type === 'Debited' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {item.type}
                                            </span>
                                            <span className='font-bold text-lg'>
                                                {item.type === 'Debited' ? 
                                                    <span className='text-red-600'>-₹{parseFloat(item.amount).toFixed(2)}</span> : 
                                                    <span className='text-green-600'>+₹{parseFloat(item.amount).toFixed(2)}</span>
                                                }
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Responsive Add Transaction Button */}
            <div className='fixed bottom-4 right-4 sm:bottom-5 sm:right-16'>
                <button 
                    onClick={() => setShowModal(true)} 
                    className='bg-black border-black border-2 rounded-full w-14 h-14 sm:w-auto sm:h-16 sm:px-6 text-white text-sm sm:text-lg hover:bg-gray-800 transition-colors flex items-center justify-center shadow-lg'
                >
                    <span className='hidden sm:inline'>Add Transaction</span>
                    <span className='text-2xl sm:ml-2'>+</span>
                </button>
            </div>

            {showModal && (
                <Modal 
                    onClose={() => setShowModal(false)} 
                    onSubmit={addTransaction} 
                />
            )}

            {/* Toast container for notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="mt-16 sm:mt-0"
            />
        </>
    );
};

export default Transaction;