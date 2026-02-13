import React from 'react';
import './Loader.css';

const Loader = ({ message = "আপনার খাবার লোড হচ্ছে, অপেক্ষা করুন..." }) => {
    return (
        <div className="loader-container">
            <h1>{message}</h1>
            <div id="cooking">
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div id="area">
                    <div id="sides">
                        <div id="pan"></div>
                        <div id="handle"></div>
                    </div>
                    <div id="pancake">
                        <div id="pastry"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
