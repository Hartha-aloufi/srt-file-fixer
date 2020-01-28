import React from 'react';
import {Button} from 'antd';

const RightMenu = (props) => {
    return (
        <section className="right-menu">
            <div className="right-menu__header">
                <h3 className="right-menu__title">FIX SRT FILES</h3>
            </div>
            <div className="right-menu__body">
                <p className="right-menu__msg">
                    All files subtitles will be fix in respect of : end time 
                    and replacing # with new line .
                </p>

                <p className="right-menu__msg">
                    Number of lines and their length will be checked but not fixes 
                </p>


              
            </div>
            <div className="right-menu__footer">
                <Button disabled={props.disableFixBtn} block type="primary" size="large" onClick={props.onFix} >
                    {
                        props.refix ? 'Refix Files' : 'Fix Files'
                    }
                </Button>
            </div>
        </section>
    )
}

export default RightMenu;