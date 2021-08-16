import React from 'react';
import Loader from "react-loader-spinner";
import "./styles/Loading.css";

export default function Loading({ visible }) {
    let loader = <div className="loader" >
        <Loader id="currentLoader" type="ThreeDots" color="#00BFFF" height={100} width={100} />
        <h3 id="title">Učitavanje, molimo pričekajte...</h3>
    </div>;

    if (visible) {
        return loader;
    }
    else {
        return null;
    }
}