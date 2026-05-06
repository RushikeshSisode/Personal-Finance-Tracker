import React from 'react';
import './style.css';

const Input = ({ label, state, setState, placeholder,type}) => {
  return (
    <div className='input-wrapper'>
      <p className='label-input'>{label}</p> 
      <input
        className='custo-input'
        type={type} 
        onChange={(e) => setState(e.target.value)} 
        value={state} 
        placeholder={placeholder} 
      /> 
    </div>
  );
};

export default Input;

