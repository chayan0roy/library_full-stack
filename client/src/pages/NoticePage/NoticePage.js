import React from 'react'
import './NoticePage.css'
import { useSelector } from 'react-redux';

export default function NoticePage() {

    const noticeData = useSelector((state) => state.noticeData.notice);

    return (
        <div className='pt-20'>
            {
                noticeData ?
                    <>
                        <h2>{noticeData.title}</h2>
                        <p>{noticeData.description}</p>
                        <p>{noticeData.date}</p>
                    </>
                    :
                    <></>
            }
        </div>
    )
}
