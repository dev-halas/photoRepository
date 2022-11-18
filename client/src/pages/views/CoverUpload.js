import React from 'react';
import CoverPhotoFileInput from '../../components/atoms/CoverPhotoFileInput/CoverPhotoFileInput';

const CoverUpload = () => {
    const coverChange = () => {};

    return (
        <>
            <CoverPhotoFileInput onChange={coverChange} />
        </>
    );
};

export default CoverUpload;
