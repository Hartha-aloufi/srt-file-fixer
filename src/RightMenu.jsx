import React from 'react';
import Button from './Button'
import {Icon} from 'antd';

const rightMenu = (props) => {
    return (
        <sectoin className="right-menu">
            <div className="right-menu__header">
                <h3 className="right-menu__title">FIX SRT FILES</h3>
            </div>
            <div className="right-menu__body">
                <p className="right-menu__msg">
                    All images will be compressed with the best quality and filesize ratio.
                </p>
            </div>
            <div className="right-menu__footer">
                <Button type="primary">Fix Files</Button>
            </div>
        </sectoin>
    )
}

export default rightMenu;