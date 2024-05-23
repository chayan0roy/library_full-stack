import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AddGalleryImage() {
    const [imageCategory, setImageCategory] = useState([]);
    const [selectCategory, setSelectCategory] = useState('');
    const [galleryImage, setGalleryImage] = useState([]);

    useEffect(() => {
        getImageCategoryList();
    }, []);

    const getImageCategoryList = async () => {
        try {
            const result = await axios.get(`http://localhost:5000/Admin/viewCategory`);

            if (result.data.status === true) {
                setImageCategory(result.data.categoryList);
                setSelectCategory(result.data.categoryList[0]);
            } else {
                alert(result.data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to fetch category list");
        }
    }



    const handlePdf2Change = (e) => {
        const files = Array.from(e.target.files);
        setGalleryImage(files);
    };



    const handleAddBook = async () => {
        const formData = new FormData();

        formData.append("selectCategory", selectCategory);
        galleryImage.forEach((file, index) => {
            formData.append("galleryImage", file); // Ensure that the field name matches
        });

        try {
            const result = await axios.post(`http://localhost:5000/Admin/addImagesFromGallery`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (result.data.status === true) {
                alert("Images added successfully!!!");
            } else {
                alert(result.data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to add images");
        }
    };


    return (
        <div className='pt-20'>
            {imageCategory.length > 0 ? (
                <>
                    <div className="input_text_box_Area flex">
                        <select className='input_box' value={selectCategory} onChange={(e) => setSelectCategory(e.target.value)}>
                            {imageCategory.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <input type="file" onChange={handlePdf2Change} multiple required />
                    <button onClick={handleAddBook}>Add Images</button>
                </>
            ) : (
                <p>No categories found</p>
            )}
        </div>
    );
}
