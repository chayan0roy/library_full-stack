import React, { useEffect } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addBookList } from '../../store/slice/BooksSlice';
import TopImageSlider from '../../components/TopImageSlider/TopImageSlider'
import CardSlider from '../../components/CardSlider/CardSlider';


export default function Home() {
    const dispatch = useDispatch();

    useEffect(() => {
        Handle_Get_All_New_Subject();
    }, []);

    const Handle_Get_All_New_Subject = async () => {

        try {
            const result = await axios.get(`http://localhost:5000/User/getBooks`);

            if (result.data.status === true) {
                dispatch(addBookList(result.data.existingBook));
            } else {
                alert(result.data.error);
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className='w-full h-auto'>
            <TopImageSlider />
            <CardSlider catagory={"First"} />
        </div>
    )
}