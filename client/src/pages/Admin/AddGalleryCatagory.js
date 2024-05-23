import React, { useState } from 'react';
import axios from 'axios';

export default function AddGalleryCatagory() {
    const [category, setCategory] = useState('');

    const handleAddGalleryCatagory = async () => {
        const formData = new FormData();
        formData.append("category", category);

        try {
            const result = await axios.post(`http://localhost:5000/Admin/addCategory`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (result.data.status === true) {
                alert("Catagory added successfully!!!");
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
            <input type="text" placeholder='Please Enter Catagory Name' value={category} onChange={(e) => setCategory(e.target.value)} required />
            <button onClick={handleAddGalleryCatagory}>Add Gallery Catagory</button>
        </div>
    );
}
