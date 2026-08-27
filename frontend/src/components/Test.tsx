import type React from "react";

import css from '../assets/test.css?raw'
export function Test():React.JSX.Element {
    return (
        <div className="box">
            <style>{css}</style>
            <header>
                <div className="site-title"></div>
                <div className="search">
                    <input type="text" />
                </div>
            </header>
        </div>
    );
}