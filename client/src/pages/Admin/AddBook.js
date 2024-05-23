import React, { useState } from 'react';
import axios from 'axios';
import addPhoto from '../../assets/accont.png';

export default function AddBook() {
    const [viewImage, setViewImage] = useState(addPhoto);
    const [bookIMG, setBookIMG] = useState(null);
    const [name, setName] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [description, setDescription] = useState('');
    const [firstCatagory, setFirstCatagory] = useState('');
    const [secondCatagory, setSecondCatagory] = useState('');
    const [pdf1, setPdf1] = useState(null);
    const [pdf2, setPdf2] = useState(null);

    const convertUserIMG = (e) => {
        const file = e.target.files[0];
        setBookIMG(file);
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            setViewImage(fileReader.result);
        };
    };

    const handleAddBook = async () => {
        const formData = new FormData();

        formData.append('bookIMG', bookIMG);
        formData.append("name", name);
        formData.append("authorName", authorName);
        formData.append("description", description);
        formData.append("firstCatagory", firstCatagory);
        formData.append("secondCatagory", secondCatagory);
        formData.append('pdf1', pdf1);
        formData.append('pdf2', pdf2);

        try {
            const result = await axios.post(`http://localhost:5000/Admin/addBook`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (result.data.status === true) {
                alert("Book added successfully!!!");
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
            <div className="image-input-field">
                <input className='input-image' type="file" onChange={convertUserIMG} required />
                <img className='input-field-image' src={viewImage} alt="Uploaded" />
            </div>
            <input type="text" placeholder='Please Enter Book Name' value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" placeholder='Please Enter Author Name' value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
            <input type="text" placeholder='Please Enter Description' value={description} onChange={(e) => setDescription(e.target.value)} required />
            <input type="text" placeholder='Please Enter First Catagory' value={firstCatagory} onChange={(e) => setFirstCatagory(e.target.value)} required />
            <input type="text" placeholder='Please Enter Second Catagory' value={secondCatagory} onChange={(e) => setSecondCatagory(e.target.value)} required />
            <input type="file" onChange={(e) => setPdf1(e.target.files[0])} required />
            <input type="file" onChange={(e) => setPdf2(e.target.files[0])} required />
            <button onClick={handleAddBook}>Add Book</button>
        </div>
    );
}
