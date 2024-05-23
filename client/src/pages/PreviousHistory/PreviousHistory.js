import React from 'react'
import { useSelector } from 'react-redux';

export default function PreviousHistory() {

    const profileData = useSelector((state) => state.profile.profile);
    console.log(profileData);


    return (
        <div className='pt-20'>
            <div>
                <img src='' />
            </div>
            <div>
                <h2>Book Name : History</h2>
                <p>Taking date : 20/22/2020</p>
                <ul>
                    <li>
                        <p>Renue date: 20/22/2020</p>
                        <p>Renue Time: 5 days letter</p>
                        <p>Fine: 0</p>
                    </li>
                </ul>
                <p>Submit Date: 20/22/2020</p>
            </div>
        </div>
    )
}
{/* <img src={`http://localhost:5000/uploads/${profileData.profileIMG}`} alt='Profile' /> */ }