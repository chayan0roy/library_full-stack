import React, { useState } from "react";
import HTMLFlipBook from "react-pageflip";
import "./FlipBook.css";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
// import pdf from '../../assets/PDF1.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Pages = React.forwardRef((props, ref) => {
    return (
        <div className="demoPage" ref={ref} >
            <p>{props.children}</p>
            <p>Page number: {props.number}</p>
        </div>
    );
});


export default function FlipBook({ pdf }) {
    const [numPages, setNumPages] = useState(null);
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };
    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="text-4xl font-bold md:font-extrabold text-block">History</div>
            <HTMLFlipBook width={350} height={450} showCover={true}>
                {
                    [...Array(numPages).keys()].map((n) => (
                        <Pages number={`${n + 1}`}>
                            <Document
                                file={pdf}
                                onLoadSuccess={onDocumentLoadSuccess}

                            >
                                <Page pageNumber={n + 1} renderAnnotationLayer={false} renderTextLayer={false} width={350} className='border-3 border-black' />
                            </Document>

                        </Pages>
                    ))
                }
            </HTMLFlipBook>
        </div>
    );
}
