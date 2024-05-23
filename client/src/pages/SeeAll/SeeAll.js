import React from 'react'
import './SeeAll.css'
import { useSelector } from 'react-redux';
import BookCard from '../../components/BookCard/BookCard'

export default function SeeAll() {

    let bookList = useSelector(state => state.bookData.bookList);
    let bookCatagory = useSelector(state => state.bookData.bookCatagory);

    return (
        <div className='AllBooks'>
            <div className='allBooksAreaTop'>
                <h1>{bookCatagory}</h1>
                <input type='search' placeholder='Search here' className='allBooksAreaTopSearch' />
                <h3>Filter</h3>
            </div>
            <div className='allBooksArea'>
                {bookList ?
                    bookList.map((data) => {
                        if (data.firstCatagory === bookCatagory) {
                            return (
                                <BookCard data={data} />
                            )
                        }
                    })
                    :
                    <></>
                }
            </div>
        </div>
    )
}
