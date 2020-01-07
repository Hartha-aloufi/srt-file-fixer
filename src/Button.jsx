import React from 'react';

const checkbox = (props) => {
   const {type, className, onClick, icon, text, ...rest} = props;
  return (
      <button 
         className={`button ${type ? 'button--' + type : ''} ${className}`}
         onClick={onClick}
         {...rest}
      >
         
         {text}
         {props.children}
   </button>
  )
}

export default checkbox; 