import { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './store/slice/AuthSlice';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Auth from './pages/Auth/Auth';
import ApproveByOTP from './pages/Auth/ApproveByOTP';
import PasswordChange from './pages/Auth/PasswordChange';
import PasswordResetLink from './pages/Auth/PasswordResetLink';

import Home from './pages/Home/Home';
import SeeAll from './pages/SeeAll/SeeAll';
import ImageGallery from './pages/ImageGallery/ImageGallery';
import AllBooks from './pages/AllBooks/AllBooks';
import NoticeListPage from './pages/NoticePage/NoticeListPage';
import NoticePage from './pages/NoticePage/NoticePage';
import BookCollect from './pages/BookCollect/BookCollect';
import Dashboard from './pages/Dashboard/Dashboard';
import EditBook from './pages/Admin/EditBook';
import GiveBook from './pages/Admin/GiveBook';
import ReciveBook from './pages/Admin/ReciveBook';
import RenueBook from './pages/Admin/RenueBook';


export default function App() {
	const dispatch = useDispatch();
	const whoIsLogin = useSelector((state) => state.auth.user);
	const isDashboard = useSelector((state) => state.dashboardData.dashboard);

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		const token = Cookies.get('auth_token');
		if (token) {
			try {
				const result = await axios.post(`http://localhost:5000/User/checkAuth`, null, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});

				if (result.data.status) {
					dispatch(login(result.data.role));
				} else {
					Cookies.remove('auth_token');
					dispatch(logout());
				}
			} catch (error) {
				Cookies.remove('auth_token');
				dispatch(logout());
			}
		} else {
			dispatch(logout());
		}
	};


	return (
		<Router>
			<Navbar />
			{!whoIsLogin || whoIsLogin === null ? (
				<Routes>
					<Route path="/" element={<Auth />} />
					<Route path="*" element={<Navigate to="/" />} />
					<Route path="/ApproveByOTP" element={<ApproveByOTP />} />
					<Route path="/PasswordResetLink" element={<PasswordResetLink />} />
					<Route path="/PasswordChange/:id/:token" element={<PasswordChange />} />
				</Routes>
			) : whoIsLogin === "Admin" ? (
				isDashboard ? (
					<Dashboard />
				) : (
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="*" element={<Navigate to="/" />} />
						<Route path="/SeeAll" element={<SeeAll />} />
						<Route path="/AllBooks" element={<AllBooks />} />
						<Route path="/ImageGallery" element={<ImageGallery />} />
						<Route path="/NoticeListPage" element={<NoticeListPage />} />
						<Route path="/NoticePage" element={<NoticePage />} />
						<Route path="/BookCollect" element={<BookCollect />} />
						<Route path="/EditBook" element={<EditBook />} />
						<Route path="/GiveBook" element={<GiveBook />} />
						<Route path="/ReciveBook" element={<ReciveBook />} />
						<Route path="/RenueBook" element={<RenueBook />} />
					</Routes>
				)
			) : (
				isDashboard ? (
					<Dashboard />
				) : (
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="*" element={<Navigate to="/" />} />
						<Route path="/SeeAll" element={<SeeAll />} />
						<Route path="/AllBooks" element={<AllBooks />} />
						<Route path="/ImageGallery" element={<ImageGallery />} />
						<Route path="/NoticeListPage" element={<NoticeListPage />} />
						<Route path="/NoticePage" element={<NoticePage />} />
						<Route path="/BookCollect" element={<BookCollect />} />
					</Routes>
				)
			)}
		</Router>
	);

}
