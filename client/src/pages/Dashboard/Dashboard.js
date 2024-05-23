import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import AddBook from '../Admin/AddBook';
import AddGalleryCatagory from '../Admin/AddGalleryCatagory';
import AddGalleryImage from '../Admin/AddGalleryImage';
import AddNotice from '../Admin/AddNotice';
import Profile from '../Profile/Profile'
import BookTaked from '../BookTaked/BookTaked'
import PreviousHistory from '../PreviousHistory/PreviousHistory'

export default function Dashboard() {

    const whoIsLogin = useSelector((state) => state.auth.user);

    return (
        <div className='pt-20'>
            {
                whoIsLogin === "Admin" ?
                    <>
                        <div>
                            <Link to="/" >Profile</Link>
                            <Link to="/AddBook" >AddBook</Link>
                            <Link to="/AddGalleryCatagory" >AddGalleryCatagory</Link>
                            <Link to="/AddGalleryImage" >AddGalleryImage</Link>
                            <Link to="/AddNotice" >AddNotice</Link>
                        </div>
                        <div>
                            <Routes>
                                <Route path="/" element={<Profile />} />
                                <Route path="*" element={<Navigate to="/" />} />
                                <Route path="/AddBook" element={<AddBook />} />
                                <Route path="/AddGalleryCatagory" element={<AddGalleryCatagory />} />
                                <Route path="/AddGalleryImage" element={<AddGalleryImage />} />
                                <Route path="/AddNotice" element={<AddNotice />} />
                            </Routes>
                        </div>
                    </>
                    :
                    <>
                        <div>
                            <Link to="/" >Profile</Link>
                            <Link to="/BookTaked" >BookTaked</Link>
                            <Link to="/PreviousHistory" >PreviousHistory</Link>
                        </div>
                        <div>
                            <Routes>
                                <Route path="/" element={<Profile />} />
                                <Route path="*" element={<Navigate to="/" />} />
                                <Route path="/BookTaked" element={<BookTaked />} />
                                <Route path="/PreviousHistory" element={<PreviousHistory />} />
                            </Routes>
                        </div>
                    </>
            }
        </div>
    )
}


