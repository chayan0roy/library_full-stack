
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllBooks.css'
import BookCard from '../../components/BookCard/BookCard'

export default function AllBooks() {

	const [searchBooks, setSearchBooks] = useState('');
	const [foundBooks, setFoundBooks] = useState([]);

	const handleSearch = async (val) => {
		try {
			const result = await axios.get(`http://localhost:5000/User/searchBooks`, {
				params: { query: val }
			});
			setFoundBooks(result.data.foundBooks);
		} catch (error) {
			console.error(error);
		}
	};


	useEffect(() => {
		const timer = setTimeout(() => {
			handleSearch(searchBooks);
		}, 1000);

		return () => {
			clearTimeout(timer);
		}
	}, [searchBooks])

	return (
		<div className='AllBooks'>
			<div className='allBooksAreaTop'>
				<h1>AllBooks</h1>
				<input type='search' placeholder='Search here' onChange={(e) => setSearchBooks(e.target.value)} className='allBooksAreaTopSearch' />
				<h3>Filter</h3>
			</div>
			<div className='allBooksArea'>
				{
					foundBooks ?
						foundBooks.map((data) => {
							return (
								<BookCard data={data} />
							)
						})
						:
						<></>
				}
			</div>
		</div>
	)
}

