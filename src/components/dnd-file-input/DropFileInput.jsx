import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './drop-file-input.css';

import { ImageConfig } from '../../config/ImageConfig';
import uploadImg from '../../assets/cloud-upload-regular-240.png';

const DropFileInput = props => {

    const wrapperRef = useRef(null);

    const [file, setFile] = useState(null);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            setFile(newFile);
            props.onFileChange(newFile);
        }
    }

    const fileRemove = () => {
        setFile(null);
        props.onFileChange(null);
    }

    return (
        <>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <p>Перетягніть ваш словник сюди</p>
                </div>
                <input type="file" value="" accept=".csv" onChange={onFileDrop} />
            </div>
            {
                file ? (
                    <div className="drop-file-preview">
                        <p className="drop-file-preview__title">
                            Словник готовий до вивчення
                        </p>
                        <div className="drop-file-preview__item">
                            <img src={ImageConfig[file.type.split('/')[1]] || ImageConfig['default']} alt="" />
                            <div className="drop-file-preview__item__info">
                                <p>{file.name}</p>
                                <p>{file.size}B</p>
                            </div>
                            <span className="drop-file-preview__item__del" onClick={() => fileRemove()}>x</span>
                        </div>
                    </div>
                ) : null
            }
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;