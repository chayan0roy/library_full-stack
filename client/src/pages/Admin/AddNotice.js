import React, { useState } from 'react';
import axios from 'axios';

export default function AddNotice() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleAddNotice = async () => {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);

        try {
            const result = await axios.post(`http://localhost:5000/Admin/addNotice`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (result.data.status === true) {
                alert("Notice added successfully!!!");
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
            <input type="text" placeholder='Please Enter Book Name' value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="text" placeholder='Please Enter Author Name' value={description} onChange={(e) => setDescription(e.target.value)} required />
            <button onClick={handleAddNotice}>Add Notice</button>
        </div>
    );
}
