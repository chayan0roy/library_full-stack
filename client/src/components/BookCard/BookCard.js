import React from 'react'
import './BookCard.css'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addBookData } from '../../store/slice/BooksSlice';
import CustomButton1 from '../CustomButton/CustomButton1';
import editIcon from '../../assets/edit.png'

export default function BookCard({ data }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const whoIsLogin = useSelector((state) => state.auth.user);

	const goCollectBook = (val) => {
		dispatch(addBookData(val))
		navigate("/BookCollect");
	}

	const goEditBook = (val) => {
		dispatch(addBookData(val))
		navigate("/EditBook");
	}

	const goGiveBook = (val) => {
		dispatch(addBookData(val))
		navigate("/GiveBook");
	}

	return (
		<div className="card">
			{
				whoIsLogin === "Admin" ?
					<>
						<div className='cardEditIconArea'>
							<img src={editIcon} className='cardEditIcon' onClick={() => goEditBook(data)} />
						</div>
						<img src={`http://localhost:5000/uploads/${data.bookIMG}`} className='cardProductImage' />
						<div className="info">
							<h1>{data.name}</h1>
							<p>{data.description}</p>

							<CustomButton1 title={"Give Book"} fun={() => goGiveBook(data)} padding={"10px 20px"} />

						</div>
					</>
					:
					<>
						<img src={`http://localhost:5000/uploads/${data.bookIMG}`} className='cardProductImage' />
						<div className="info">
							<h1>{data.name}</h1>
							<p>{data.description}</p>
							<CustomButton1 title={"Collect Book"} fun={() => goCollectBook(data)} padding={"10px 20px"} />
						</div>
					</>
			}
		</div>
	)
}
