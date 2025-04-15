import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import Modal from './Model';
import { parse, v4 as uuidv4 } from 'uuid';
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import { FaSortAmountDown } from "react-icons/fa";
import { data } from 'autoprefixer';

const Transation = () => {
    // const key = useRef(0);
    const [showModal, setShowModal] = useState(false);
    const [Transationhistory, setTransationhistory] = useState([])
    const [totalamount, settotalAmount] = useState(0)
    const [Monthlyexpense, setMonthlyexpense] = useState(0);

    useEffect(() => {
        const monthamount = JSON.parse(localStorage.getItem("monthamount"));
        if(monthamount === null){
            setMonthlyexpense(monthamount);
        }else{
            setMonthlyexpense(monthamount)
        }
        // setMonthlyexpense(0)?(monthamount === null):setMonthlyexpense(monthamount)
        const lastamount = JSON.parse(localStorage.getItem("amount"));
        if(lastamount === null){
            settotalAmount(0);
        }else{
            settotalAmount(lastamount)
        }
        
        const data = JSON.parse(localStorage.getItem("transaction"));
        if (data) {
            setTransationhistory(data);
        }
    }, [])

    useEffect(() => {
            setTransationhistory(prev=> prev.filter(index=> toconsider(index.date)===true))
    }, [totalamount])
    

    function toconsider(dateStr) {
        const givenDate = new Date(dateStr);
        const today = new Date();
        const fortyDaysAgo = new Date();
        fortyDaysAgo.setDate(today.getDate() - 40);
      
        // Compare full date, not just day of month
        return givenDate >= fortyDaysAgo && givenDate <= today;
      }

    const sameMonth = (d)=>{
      let today = new Date();
      let date = new Date(d);
      if(today.getMonth() == date.getMonth()){
        // alert("same month");
        return true;
      }   
    //   alert("different month");
      return false
    }


    const notify = () => toast("Transation added");

    const saveData = function (data) {
        // console.log(Transationhistory);
        localStorage.setItem("transaction", JSON.stringify(data));
    }

    const saveTransation = (data) => {
        if (data.type === 'Debited') {
            settotalAmount(totalamount - parseInt(data.amount))
            localStorage.setItem("amount", JSON.stringify(totalamount - parseInt(data.amount)));
            if(sameMonth(data.date)){
                setMonthlyexpense(Monthlyexpense+ parseInt(data.amount));
                localStorage.setItem("monthamount", JSON.stringify(Monthlyexpense+parseInt(data.amount)));
            }
        } else {
            settotalAmount(totalamount + parseInt(data.amount))
            localStorage.setItem("amount", JSON.stringify(totalamount + parseInt(data.amount)));
        }
        // setTransationhistory([...Transationhistory, { ...data, id: uuidv4() }]);        //doing this will create the problem before the item sets in transaction history it get saved
       
        console.log(`giving amount ${totalamount}`)
        const newdata = [...Transationhistory, { ...data, id: uuidv4() }]
        setTransationhistory(newdata)
        saveData(newdata);
        setShowModal(false);
        notify();
        <ToastContainer /> 
    }

    const handledelete = (id) => {
        if (prompt(`enter the safety pin`) === '123') {
            console.log(`element deleted with id ${id}`);
            const newdata = Transationhistory.filter(index => index.id != id)
            setTransationhistory(newdata);
            saveData(newdata);
        }
    }
    const delelteall = () => {
        if (prompt(`enter the saftey pin`) === '123') {
            setTransationhistory([]);
            saveData([]);
        }
    }
    const sorthistory = () => {
        setTransationhistory([...Transationhistory].sort((a, b) => b.amount - a.amount));
        console.log('element sorted');
    }

    return (<>
        <ToastContainer
            position="bottom-left"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            draggable
            pauseOnHover
            theme="dark"
        />
        <div className=''>
            <h3 className='font-bold text-4xl px-16 py-8'>Dashboard</h3>
            <div className='flex justify-center'>
                <div className='text-center h-[12vh] w-[60vw] bg-black rounded-3xl text-white font-bold text-3xl py-7'>
                    total amount : {totalamount}
                </div>
            </div>
        </div>


        <div className='p-2 w-[80vw] m-auto  mt-6 '>
            <h2 className='text-bold text-lg'>Monthly Expense  <span className='text-red-400 font-semibold'>-{Monthlyexpense}</span> </h2>
        </div>


        <div className='flex justify-center'>
            <div className='min-h-[50vh] w-[80vw] bg-slate-200 p-4'>
                <div className='text-xl p-2 flex justify-between'>
                    <span className='text-xl font-bold'>Transation History</span>
                    <span className='flex gap-6 text-lg'>
                        <button onClick={delelteall} className=' flex border-black border-2 py-0.5 px-2 rounded-3xl w-40'>Clear History <span className='p-1.5'><MdDeleteForever /></span></button>
                        <button onClick={sorthistory} className=' flex border-black border-2 py-0.5 px-2 rounded-3xl'>Sort <span className='p-1.5'><FaSortAmountDown /></span></button>
                    </span>
                </div>

                <table className="table-auto w-full overflow-hidden rounded-lg ">
                    <thead className=''>
                        <tr>
                            <th className='text-center w-32 py-2'>Date</th>
                            <th className='text-center w-32 py-2'>Thing</th>
                            <th className='text-center w-32 py-2'>Amount</th>
                            <th className='text-center w-32 py-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {Transationhistory.map((item) => {
                            return <tr key={uuidv4()}>
                                <td className='text-center w-32 py-2 '>{item.date}</td>
                                <td className='text-center w-32 py-2 '>{item.title}</td>
                                {item.type === 'Debited' ? <td className='text-center w-32 py-2 text-red-600'>-{item.amount}</td> : <td className='text-center w-32 py-2 text-green-600'>+{item.amount}</td>}
                                <td className='text-center w-32 py-2 '>
                                    <button onClick={() => { handledelete(item.id) }}>
                                        <MdDeleteForever size={24} />
                                    </button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>


        <div className='w-[85vw] text-right m-2 '>
            <button onClick={() => setShowModal(true)} className='bg-black border-black border-2 rounded-full w-[15vw] p-4 text-white h-16 text-lg fixed right-16 bottom-5'>Add Transaction +</button>
            {showModal && (<Modal onClose={() => setShowModal(false)} onSubmit={saveTransation} />)}
        </div>
        {/* <div className='text-right w-[80vw]'>
            <button onClick={saveTransation} className='bg-black border-black border-2 rounded-full w-[15vw] p-4 text-white h-16 text-lg fixed right-16 bottom-5'>Add Transaction</button>
        </div> */}
    </>
    )
}

export default Transation


// usestate cause the page rerender whenever change in the state while useref do not rerender the page when the value getes updated but both of them does not persist the element on refresh so we have to use some storage for persisting the elements accross refereshes