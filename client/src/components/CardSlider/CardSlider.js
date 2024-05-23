import React from 'react'
import './CardSlider.css'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addBookCatagory, deleteBookCatagory } from '../../store/slice/BooksSlice';
import BookCard from '../../components/BookCard/BookCard';
import CustomButton3Right from '../../components/CustomButton/CustomButton3Right';
import CustomButton3Left from '../../components/CustomButton/CustomButton3Left';


export default function CardSlider({ catagory }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let bookList = useSelector(state => state.bookData.bookList);

    const goSeeAll = (val) => {
        dispatch(deleteBookCatagory());
        dispatch(addBookCatagory(val));
        navigate('/SeeAll');
    }

    const CustomNextArrow = (props) => {
        const { onClick } = props;
        return (
            <div className="rightArrowCls">
                <CustomButton3Right fun={onClick} height={"1.5vw"} width={"1.5vw"} />
            </div>

        );
    };

    const CustomPrevArrow = (props) => {
        const { onClick } = props;
        return (
            <div className="LeftArrowCls">
                <CustomButton3Left fun={onClick} height={"1.5vw"} width={"1.5vw"} />
            </div>
        );
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 2,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />
    };

    return (
        <div className="w-full my-4">
            <div className='m-auto	w-11/12 h-20 flex justify-between items-center'>
                <h2 className='text-xl font-bold'>{catagory}</h2>
                <div className='mr-12'>
                    <CustomButton3Right fun={() => goSeeAll(catagory)} height={"1vw"} width={"1vw"} />
                </div>
            </div>
            <Slider {...settings}>
                {
                    bookList ?
                        bookList.map((data) => {
                            if (data.firstCatagory === catagory) {
                                return (
                                    <BookCard data={data} />
                                )
                            }
                        })
                        :
                        <></>
                }
            </Slider>
        </div>
    )

}