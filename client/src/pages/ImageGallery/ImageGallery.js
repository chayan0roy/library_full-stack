import { useEffect, useState } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faCircleChevronRight, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import './ImageGallery.css'
import CustomButton1 from "../../components/CustomButton/CustomButton1";

export default function ImageGallery() {

    const [galleryImages, setGalleryImages] = useState();
    const [imageList, setImageList] = useState();

    useEffect(() => {
        handleGetGalleryImages();
    }, [])

    const handleGetGalleryImages = async () => {
        try {
            const result = await axios.get(`http://localhost:5000/User/getImages`);

            if (result.data.status === true) {
                setGalleryImages(result.data.existingImage);
                setImageList(result.data.existingImage[0]);
            } else {
                alert(result.data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to get images list");
        }
    }

    const [slideNumber, setSlideNumber] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = (index) => {
        setSlideNumber(index);
        setOpenModal(true);
    };

    // Close Modal
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // Previous Image
    const prevSlide = () => {
        slideNumber === 0
            ? setSlideNumber(imageList.imageList.length - 1)
            : setSlideNumber(slideNumber - 1);
    };

    // Next Image
    const nextSlide = () => {
        slideNumber + 1 === imageList.imageList.length
            ? setSlideNumber(0)
            : setSlideNumber(slideNumber + 1);
    };


    return (
        <div className="ImageGallery">
            <div className="topArea">
                <div className="topAboutArea">
                    <h1>About Library</h1>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </div>
            </div>
            {
                galleryImages ?
                    <div className="galaeryArea">
                        <div className="navigationTabBar">
                            {
                                galleryImages.map((data) => {
                                    return (
                                        <CustomButton1 padding={"15px 25px"} title={data.category} fun={() => setImageList(data)} />
                                    )
                                })
                            }
                        </div>
                        {
                            openModal && (
                                <div className="sliderWrap">
                                    <FontAwesomeIcon
                                        icon={faCircleXmark}
                                        className="btnClose"
                                        onClick={handleCloseModal}
                                    />
                                    <FontAwesomeIcon
                                        icon={faCircleChevronLeft}
                                        className="btnPrev"
                                        onClick={prevSlide}
                                    />
                                    <FontAwesomeIcon
                                        icon={faCircleChevronRight}
                                        className="btnNext"
                                        onClick={nextSlide}
                                    />
                                    <div className="fullScreenImage">
                                        <img src={`http://localhost:5000/uploads/${imageList.imageList[slideNumber]}`} alt="" />
                                    </div>
                                </div>
                            )
                        }
                        <div className="galleryWrap">
                            {imageList && imageList.imageList &&
                                imageList.imageList.map((slide, index) => {
                                    return (
                                        <div
                                            className="single"
                                            key={index}
                                            onClick={() => handleOpenModal(index)}
                                        >
                                            <img src={`http://localhost:5000/uploads/${slide}`} alt="" />

                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    :
                    <></>
            }
        </div>
    )
}
