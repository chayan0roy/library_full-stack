import React, { useEffect, useState } from 'react'
import './NoticePage.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { addNotice, deleteNotice } from '../../store/slice/NoticeSlice';
import { useDispatch } from 'react-redux';
import CustomButton1 from '../../components/CustomButton/CustomButton1'

export default function NoticeListPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [allNotice, setAllNotice] = useState('')

    useEffect(() => {
        handleViewAllNotice();
    }, [])

    const handleViewAllNotice = async () => {
        try {
            const result = await axios.get(`http://localhost:5000/User/getNotice`);

            if (result.data.status === true) {
                // Format date here
                const formattedNotices = result.data.allNoticeList.map(notice => ({
                    ...notice,
                    date: formatDate(notice.date)
                }));
                setAllNotice(formattedNotices);
            } else {
                alert(result.data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to add book");
        }
    };

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };

    const viewNotice = (data) => {
        dispatch(deleteNotice());
        dispatch(addNotice(data));
        navigate('/NoticePage');
    }

    return (
        <div className='pt-20'>
            {
                allNotice ?
                    allNotice.map((data, index) => {
                        return (
                            <div key={index}>
                                <h1>{data.title}</h1>
                                <h3>{data.description}</h3>
                                <h4>{data.date}</h4>
                                <CustomButton1 title={"View Notice"} fun={() => viewNotice(data)} padding={"12px 25px"} />
                            </div>
                        );
                    })
                    :
                    <></>
            }
        </div>
    )
}
