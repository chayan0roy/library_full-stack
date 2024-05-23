import React from 'react'
import BookCard from '../../components/BookCard/BookCard'

export default function SearchPage() {
    return (
        <div>
            <div>
                <input type='search' placeholder='Search here...'></input>
            </div>
            <div>
                <BookCard />
            </div>
        </div>
    )
}
