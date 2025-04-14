import React, { useRef } from 'react'
import { useState } from 'react';
import Modal from './Model';
import { v4 as uuidv4 } from 'uuid';
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';

const Transation = () => {
    // const key = useRef(0);
    const [showModal, setShowModal] = useState(false);
    const [Transationhistory, setTransationhistory] = useState([])
    const [totalamount, settotalAmount] = useState(10000)

    const notify = () => toast("Transation added");

    const saveTransation = (data) => {
        if (data.type === 'Debited') {
            settotalAmount(totalamount - parseInt(data.amount));
        } else {
            settotalAmount(totalamount + parseInt(data.amount));
        }
        setTransationhistory([...Transationhistory, { ...data, id: uuidv4() }]);
        setShowModal(false);
        notify();
        <ToastContainer />

    }

    const handledelete = (id) => {
        console.log(`element deleted with id ${id}`);
        setTransationhistory(Transationhistory.filter(index => index.id != id));
        //console.log("All IDs:", Transationhistory.map(item => item.id));
        //console.log("Trying to delete ID:", id);

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

        <div className='flex justify-center'>
            <div className='min-h-[50vh] w-[80vw] bg-slate-200 mt-10 p-4'>
                <h1 className='text-xl font-bold p-2'> Transation History</h1>

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
                                <td className='text-center w-32 py-2 '>{item.amount}</td>
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
        <div className='w-[85vw] text-right m-10 '>
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
