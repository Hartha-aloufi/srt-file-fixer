import React from 'react';
import Settings from '../../FixSettings/Settings';

const header = props => {
    return (
        <header className="page-header">
            <a href="#" className="page-header__title">
                <h1>STR Fixer</h1>
            </a>

            {/* in the begining I rendered this component in 
                the RightMenu so that all it's css classes refare to it
                and I'm layze to do renaming
            */}
            <Settings dispatch={props.dispatch} settings={props.settings} />
        </header>
    )
}

export default header;