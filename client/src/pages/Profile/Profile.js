import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slice/AuthSlice';
import { addProfileData } from '../../store/slice/ProfileSlice';
import CustomButton1 from '../../components/CustomButton/CustomButton1';
import addPhoto from '../../assets/accont.png';

export default function Profile() {
    const dispatch = useDispatch();

    const profileData = useSelector((state) => state.profile.profile);

    const [viewImage, setViewImage] = useState(addPhoto);
    const [image, setImage] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confromNewPassword, setConfromNewPassword] = useState('');


    useEffect(() => {
        handleGetProfile();
    }, []);

    const handleGetProfile = async () => {
        const token = Cookies.get('auth_token');
        try {
            const result = await axios.post(`http://localhost:5000/User/getProfile`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (result.data.status === true) {
                dispatch(addProfileData(result.data.existingUser));
            } else {
                alert(result.data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };



    const convertUserIMG = (e) => {
        setImage(e.target.files[0]);
        var fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = () => {
            setViewImage(fileReader.result);
        };
    };
    const handleUpdateProfileImage = async () => {
        const token = Cookies.get('auth_token');

        const formData = new FormData();
        formData.append('image', image);

        try {
            const result = await axios.post(`http://localhost:5000/User/updateProfileImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            if (result.data.status === true) {
                alert("Image Update Successful!!!");
                handleGetProfile();
            }
            else {
                alert(result.data.error)
            }
        } catch (error) {
            alert(error)
        }
    };


    const handleUpdatePassword = async () => {
        if (newPassword !== confromNewPassword) {
            return alert("newPassword and confromNewPassword are not same");
        }
        const token = Cookies.get('auth_token');

        const formData = new FormData();
        formData.append('currentPassword', currentPassword);
        formData.append('newPassword', newPassword);

        try {
            const result = await axios.post(`http://localhost:5000/User/updatePassword`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            if (result.data.status === true) {
                alert("Password Update Successful!!!");
                handleLogout();
            }
            else {
                alert(result.data.error)
            }
        } catch (error) {
            alert(error)
        }
    };


    const handleLogout = () => {
        Cookies.remove('auth_token');
        dispatch(logout());
    };


    return (
        <div className='pt-20'>
            {
                profileData ? (
                    <>
                        <div>
                            <img src={`http://localhost:5000/uploads/${profileData.profileIMG}`} alt='Profile' />
                        </div>
                        <div>
                            <div>
                                <h2>Name: {profileData.name}</h2>
                                <p>Address: {profileData.address}</p>
                                <h2>Mobile Number: {profileData.mobileNumber}</h2>
                                <h2>Email: {profileData.email}</h2>
                            </div>
                            <div>
                                <h2>Name: Biswas Library</h2>
                                <p>Address: Bagdah, 743232, north 24 Parganas, West Bengal, India</p>
                                <h2>Helpline Mobile Number: 7003103509</h2>
                                <h2>Helpline Email: tochayanroy@gmail.com</h2>
                            </div>
                        </div>
                        <div>
                            <h3>Change Profile Image</h3>
                            <div className="image-input-field">
                                <input className='input-image' type="file" onChange={convertUserIMG} />
                                <img className='input-field-image' src={viewImage} alt="Uploaded" />
                            </div>
                            <CustomButton1 title='Update Profile Image' fun={handleUpdateProfileImage} padding='12px 25px' />
                        </div>
                        <div>
                            <h3>Change Password</h3>
                            <div>
                                <input type='password' placeholder='Enter Current Password' onChange={(e) => setCurrentPassword(e.target.value)} />
                                <input type='password' placeholder='Enter New Password' onChange={(e) => setNewPassword(e.target.value)} />
                                <input type='password' placeholder='Confirm Password' onChange={(e) => setConfromNewPassword(e.target.value)} />
                            </div>
                            <CustomButton1 title='Update Password' fun={handleUpdatePassword} padding='12px 25px' />
                            <CustomButton1 title='Logout' fun={handleLogout} padding='12px 25px' />
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )
            }
        </div>
    );
}
