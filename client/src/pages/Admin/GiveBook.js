import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function GiveBook() {
    const bookData = useSelector((state) => state.bookData.bookData);

    const [selectUserID, setSelectUserID] = useState(bookData.orderedList.length !== 0 ? bookData.orderedList[0].id : null);
    const [bookAllowDate, setBookAllowDate] = useState(new Date().toISOString().split('T')[0]);
    const [renewDate, setRenewDate] = useState(new Date().toISOString().split('T')[0]);

    const handleGiveBook = async () => {
        const formData = new FormData();

        formData.append('bookId', bookData._id);
        formData.append("userId", selectUserID);
        formData.append("bookAllowDate", bookAllowDate);
        formData.append("renewDate", renewDate);

        try {
            const result = await axios.post(`http://localhost:5000/Admin/giveBook`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (result.data.status === true) {
                alert("Book Giving successfully!!!");
            } else {
                alert(result.data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to Giving book");
        }
    };


    return (
        <div className='pt-20'>
            <div className='left'>
                <img src={`http://localhost:5000/uploads/${bookData.bookIMG}`} />
                <h1>name :{bookData.name}</h1>
                <h2>authorName: {bookData.authorName}</h2>
                <p>bookLocation :{bookData.bookLocation ? "Library" : "Out Of Stock"}</p>
                <p>firstCatagory: {bookData.firstCatagory}</p>
                <p>orderedList :{bookData.orderedList.length}</p>
                <p>quantity : {bookData.quantity}</p>
            </div>

            <div className='right'>
                <div className="input_text_box_Area flex">
                    <input type='date' required value={bookAllowDate} onChange={(e) => setBookAllowDate(e.target.value)} />
                </div>
                <div className="input_text_box_Area flex">
                    <input type='date' required value={renewDate} onChange={(e) => setRenewDate(e.target.value)} />
                </div>
                <div className="input_text_box_Area flex">
                    <select className='input_box' value={selectUserID} onChange={(e) => setSelectUserID(e.target.value)}>
                        {bookData.orderedList.map((user, index) => (
                            <option key={index} value={user.id}>{user.email}</option>
                        ))}
                    </select>
                </div>
            </div>
            <button onClick={handleGiveBook}>Give Book</button>
            <Link to='/RenueBook'>Renue Book</Link>
            <Link to='/ReciveBook'>Recive Book</Link>
        </div>
    );
}
