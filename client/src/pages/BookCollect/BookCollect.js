import React from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slice/AuthSlice';
import FlipBook from '../../components/FlipBook/FlipBook'
import CustomButton1 from '../../components/CustomButton/CustomButton1'

export default function BookCollect() {
    const dispatch = useDispatch();
    const token = Cookies.get('auth_token');
    const bookData = useSelector((state) => state.bookData.bookData);
    console.log(bookData);

    const handleDownloadPdf = () => {
        console.log("handleDownloadPdf");
    }

    const handleOrderedBook = async () => {
        if (token) {
            try {
                const formData = new FormData();
                formData.append("bookId", bookData._id);

                const result = await axios.post(`http://localhost:5000/User/orderBook`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                if (result.data.status) {
                    alert(result.data.message);
                } else {
                    alert(result.data.message);
                }
            } catch (error) {
                alert(error);
            }
        } else {
            dispatch(logout());
        }
    }


    return (
        <div className='w-full pt-20'>
            {
                bookData ?
                    <>
                        <FlipBook pdf={bookData.pdfs.pdf1} />
                        <div className=' w-full flex flex-row justify-center items-center'>
                            <div className='w-9/12 mt-20'>
                                <h1>Book Name : {bookData.name}</h1>
                                <h2>Author Name : {bookData.authorName}</h2>
                                <p>Description : {bookData.description}</p>
                                <div>
                                    <h3>Book Status : {bookData.bookLocation ? "Available" : "Not Available"}</h3>
                                    <h3>Book Order Status : {bookData.orderedList.length} person Ordered</h3>
                                </div>
                            </div>
                            <div className='w-3/12'>
                                <CustomButton1 title={"Download Pdf"} fun={handleDownloadPdf} padding={"12px 35px"} />
                                <CustomButton1 title={"Ordered Book"} fun={handleOrderedBook} padding={"12px 35px"} />
                            </div>
                        </div>
                    </>
                    :
                    <></>
            }
        </div>
    )
}
