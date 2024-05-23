import React, { useRef } from 'react';
import './TopImageSlider.css';
import CustomButton3Left from '../CustomButton/CustomButton3Left';
import CustomButton3Right from '../CustomButton/CustomButton3Right';

import slider1Image from '../../assets/backgroundImg/Slider1.jpg';
import slider2Image from '../../assets/backgroundImg/Slider2.jpg';
import slider3Image from '../../assets/backgroundImg/Slider3.jpg';
import slider4Image from '../../assets/backgroundImg/Slider4.jpg';


export default function TopImageSlider() {
    const slideRef = useRef(null);

    const handleClickNext = () => {
        const items = slideRef.current.querySelectorAll('.item');
        slideRef.current.appendChild(items[0].cloneNode(true));
        slideRef.current.removeChild(items[0]);
    };

    const handleClickPrev = () => {
        const items = slideRef.current.querySelectorAll('.item');
        slideRef.current.prepend(items[items.length - 1].cloneNode(true));
        slideRef.current.removeChild(items[items.length - 1]);
    };

    return (
        <div className="imgContainer">
            <div ref={slideRef} className="slide">
                <div className="item" style={{ backgroundImage: `url(${slider1Image})` }}>
                    <div className="content">
                        <div className="name">Biswas Library</div>
                    </div>
                </div>
                <div className="item" style={{ backgroundImage: `url(${slider2Image})` }}>
                    <div className="content">
                        <div className="name">Biswas Library</div>
                    </div>
                </div>
                <div className="item" style={{ backgroundImage: `url(${slider3Image})` }}>
                    <div className="content">
                        <div className="name">Biswas Library</div>
                    </div>
                </div>
                <div className="item" style={{ backgroundImage: `url(${slider4Image})` }}>
                    <div className="content">
                        <div className="name">Biswas Library</div>
                    </div>
                </div>
                <div className="item" style={{ backgroundImage: `url(${slider1Image})` }}>
                    <div className="content">
                        <div className="name">Biswas Library</div>
                    </div>
                </div>
            </div>
            <div className="buttonBottomArea">
                <CustomButton3Left fun={handleClickPrev} height={"1.5vw"} width={"1.5vw"} />
                <CustomButton3Right fun={handleClickNext} height={"1.5vw"} width={"1.5vw"} />
            </div>
        </div>
    );
}
