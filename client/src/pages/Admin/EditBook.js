import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function EditBook() {
    const bookData = useSelector((state) => state.bookData.bookData);

    const [viewImage, setViewImage] = useState(`http://localhost:5000/uploads/${bookData.bookIMG}`);
    const [bookIMG, setBookIMG] = useState(null);
    const [pdf1, setPdf1] = useState(null);
    const [pdf2, setPdf2] = useState(null);

    const [name, setName] = useState(bookData.name);
    const [authorName, setAuthorName] = useState(bookData.authorName);
    const [description, setDescription] = useState(bookData.description);
    const [firstCatagory, setFirstCatagory] = useState(bookData.firstCatagory);
    const [secondCatagory, setSecondCatagory] = useState(bookData.secondCatagory);

    const convertUserIMG = (e) => {
        const file = e.target.files[0];
        setBookIMG(file);
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            setViewImage(fileReader.result);
        };
    };

    const handleUpdateBook = async () => {
        const formData = new FormData();

        formData.append('bookId', bookData._id);

        if (bookIMG !== null) {
            formData.append('bookIMG', bookIMG);
        }
        if (pdf1 !== null) {
            formData.append('pdf1', pdf1);
        }
        if (pdf2 !== null) {
            formData.append('pdf2', pdf2);
        }

        formData.append("name", name);
        formData.append("authorName", authorName);
        formData.append("description", description);
        formData.append("firstCatagory", firstCatagory);
        formData.append("secondCatagory", secondCatagory);

        try {
            const result = await axios.post(`http://localhost:5000/Admin/updateBook`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (result.data.status === true) {
                alert("Book updated successfully!!!");
            } else {
                alert(result.data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to update book");
        }
    };

    const handleDeleteBook = async () => {
        try {
            const result = await axios.delete(`http://localhost:5000/Admin/deleteBook/${bookData._id}`);
            if (result.data.status === true) {
                alert("Book deleted successfully!!!");
            } else {
                alert(result.data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete book");
        }
    };


    return (
        <div className='pt-20'>
            {bookData &&
                <>
                    <div className="image-input-field">
                        <input className='input-image' type="file" onChange={convertUserIMG} />
                        <img className='input-field-image' src={viewImage} alt="Uploaded" />
                    </div>
                    <input type="text" placeholder='Please Enter Book Name' value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder='Please Enter Author Name' value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
                    <input type="text" placeholder='Please Enter Description' value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input type="text" placeholder='Please Enter First Category' value={firstCatagory} onChange={(e) => setFirstCatagory(e.target.value)} />
                    <input type="text" placeholder='Please Enter Second Category' value={secondCatagory} onChange={(e) => setSecondCatagory(e.target.value)} />

                    <input type="file" onChange={(e) => setPdf1(e.target.files[0])} />
                    <input type="file" onChange={(e) => setPdf2(e.target.files[0])} />
                    <button onClick={handleUpdateBook}>Update Book</button>
                    <button onClick={handleDeleteBook}>Delete Book</button>
                </>
            }
        </div>
    );
}
