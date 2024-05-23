import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ReciveBook() {
    const bookData = useSelector((state) => state.bookData.bookData);

    const [userData, setUserData] = useState('');
    const prevFindate = userData ? new Date(userData[userData.length - 1].renewDate) : null;
    const dprevFinDay = prevFindate ? prevFindate.getUTCDate().toString().padStart(2, '0') : '';
    const prevFinMonth = prevFindate ? (prevFindate.getUTCMonth() + 1).toString().padStart(2, '0') : '';
    const prevFinYear = prevFindate ? prevFindate.getUTCFullYear() : '';
    const prevRenueDate = prevFindate ? `${dprevFinDay}-${prevFinMonth}-${prevFinYear}` : '';

    const [selectUserID, setSelectUserID] = useState(bookData.takingList.length !== 0 ? bookData.takingList[0].id : null);
    const [bookSubmitDate, setBookSubmitDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
    const [reciveFine, setReciveFine] = useState('');

    useEffect(() => {
        getUserRenueData();
    }, [bookData]);

    const getUserRenueData = async () => {

        if (bookData.takingList.length === 0) return;
        const formData = new FormData();

        formData.append('bookId', bookData._id);
        formData.append("userId", selectUserID);

        try {
            const result = await axios.post(`http://localhost:5000/Admin/userRenueData`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (result.data.status === true) {
                setUserData(result.data.userRenueData)
            } else {
                alert(result.data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to add book");
        }
    }

    const handleReciveBook = async () => {
        const formData = new FormData();

        formData.append('bookId', bookData._id);
        formData.append("userId", selectUserID);
        formData.append("bookSubmitDate", bookSubmitDate);
        formData.append("reciveFine", reciveFine);

        try {
            const result = await axios.post(`http://localhost:5000/Admin/reciveBook`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (result.data.status === true) {
                alert("Book Renue successfully!!!");
            } else {
                alert(result.data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to add book");
        }
    };


    return (
        <div className='pt-20'>
            {
                userData ?
                    <>
                        <div className='left'>
                            <img src={`http://localhost:5000/uploads/${bookData.bookIMG}`} />
                            <h1>name :{bookData.name}</h1>
                            <h2>authorName: {bookData.authorName}</h2>
                            <p>bookLocation :{bookData.bookLocation ? "Library" : "Out Of Stock"}</p>
                            <p>firstCatagory: {bookData.firstCatagory}</p>
                            <p>takingList :{bookData.takingList.length}</p>
                            <p>quantity : {bookData.quantity}</p>
                            <p>Previous RenewDate : {prevRenueDate}</p>
                            <p>Fine : {userData[userData.length - 1].fine}</p>
                        </div>

                        <div className='right'>
                            <div className="input_text_box_Area flex">
                                <input type='date' required value={bookSubmitDate} onChange={(e) => setBookSubmitDate(e.target.value)} />
                            </div>
                            <div className="input_text_box_Area flex">
                                <select className='input_box' value={selectUserID} onChange={(e) => setSelectUserID(e.target.value)}>
                                    {bookData.takingList.map((user, index) => (
                                        <option key={index} value={user.id}>{user.email}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input_text_box_Area flex">
                                <input type='number' required value={reciveFine} placeholder='Please fine amount' onChange={(e) => setReciveFine(e.target.value)} />
                            </div>
                        </div>
                    </>
                    :
                    <></>
            }
            <Link to='/GiveBook'>Give Book</Link>
            <Link to='/RenueBook'>Renue Book</Link>
            <button onClick={handleReciveBook}>Recive Book</button>
        </div>
    );
}
