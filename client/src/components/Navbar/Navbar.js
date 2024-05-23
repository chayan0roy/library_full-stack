import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Remove useSelector if not used
import { dashboardTrue, dashboardFalse } from '../../store/slice/DashBoardSlice';

export default function Navbar() {
	const dispatch = useDispatch();
	const [nav, setNav] = useState(false);

	const handleNav = () => {
		setNav(!nav);
	};

	return (
		<div className='bg-black fixed flex justify-between items-center h-20 w-full z-50 mx-auto px-4 text-white'>
			<h1 className='w-full text-3xl font-bold text-[#00df9a]'>Library.</h1>

			<ul className='hidden md:flex'>
				<li className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'>
					<Link onClick={() => dispatch(dashboardFalse())} to={'/'}>Home</Link>
				</li>
				<li className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'>
					<Link onClick={() => dispatch(dashboardFalse())} to={'/AllBooks'}>AllBooks</Link>
				</li>
				<li className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'>
					<Link onClick={() => dispatch(dashboardFalse())} to={'/ImageGallery'}>ImageGallery</Link>
				</li>
				<li className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'>
					<Link onClick={() => dispatch(dashboardFalse())} to={'/NoticeListPage'}>NoticeListPage</Link>
				</li>
				<li className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'>
					<Link onClick={() => dispatch(dashboardTrue())} to={'/Dashboard'}>Dashboard</Link>
				</li>
			</ul>

			<div onClick={handleNav} className='block md:hidden'>
				{nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
			</div>

			<ul
				className={
					nav
						? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
						: 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
				}
			>
				<h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>Library.</h1>
				<li className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'>
					<Link onClick={() => dispatch(dashboardFalse())} to={'/'}>Home</Link>
				</li>
				<li className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'>
					<Link onClick={() => dispatch(dashboardFalse())} to={'/AllBooks'}>AllBooks</Link>
				</li>
				<li className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'>
					<Link onClick={() => dispatch(dashboardFalse())} to={'/ImageGallery'}>ImageGallery</Link>
				</li>
				<li className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'>
					<Link onClick={() => dispatch(dashboardFalse())} to={'/NoticeListPage'}>NoticeListPage</Link>
				</li>
				<li className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'>
					<Link onClick={() => dispatch(dashboardTrue())} to={'/Dashboard'}>Dashboard</Link>
				</li>
			</ul>
		</div >
	);
};
