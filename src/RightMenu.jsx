import React from 'react';
import Button from './Button'

const rightMenu = (props) => {
    return (
        <section className="right-menu">
            <div className="right-menu__header">
                <h3 className="right-menu__title">FIX SRT FILES</h3>
            </div>
            <div className="right-menu__body">
                <p className="right-menu__msg">
                    All images will be compressed with the best quality and filesize ratio.
                </p>
            </div>
            <div className="right-menu__footer">
                <Button type="primary" onClick={props.onFix} >Fix Files</Button>
            </div>
        </section>
    )
}

export default rightMenu;