import React from 'react';
import { useSelector } from 'react-redux';

export default function BookTaked() {
    const profileData = useSelector((state) => state.profile.profile);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    };


    return (
        <div className='pt-20'>
            {profileData && profileData.bookTakingDetails && profileData.bookTakingDetails.length !== 0 ? (
                profileData.bookTakingDetails.map((data, index) => (
                    <div key={index}>
                        <img src={`http://localhost:5000/uploads/${data.bookIMG}`} alt='Book' />
                        <div>
                            <h1>Book Name: {data.name}</h1>
                            <h1>Author Name: {data.authorName}</h1>

                            {data.renewDetails.length > 0 && (
                                <div>
                                    <p>Book Allow Date: {formatDate(data.renewDetails[data.renewDetails.length - 1].bookAllowDate)}</p>
                                    <p>Book Renew Date: {formatDate(data.renewDetails[data.renewDetails.length - 1].renewDate)}</p>
                                    <p>Book Fine: {data.renewDetails[data.renewDetails.length - 1].fine}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <></>
            )}
        </div>
    );
}
