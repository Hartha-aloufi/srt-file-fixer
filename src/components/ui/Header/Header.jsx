import React from 'react';
import FixSettings from '../../FixSettings/FixSettings';

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
            <FixSettings dispatch={props.dispatch} settings={props.settings} />
        </header>
    )
}

export default header;