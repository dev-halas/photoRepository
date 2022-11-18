import React from 'react';
import styled from 'styled-components';
import { IoImagesOutline } from 'react-icons/io5';

const CoverPhotoFileInput = (props) => {
    return (
        <Wrapper htmlFor="file">
            {console.log(props)}
            <IoImagesOutline />
            <input id="file" type="file" onChange={props.coverChange} />
        </Wrapper>
    );
};

export default CoverPhotoFileInput;

const Wrapper = styled.label`
    display: block;
    width: 500px;
    height: 250px;
    border: 2px dashed #ededed;
    cursor: pointer;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    position: relative;

    input {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
`;
