import React from 'react';

const Dropdown = props => {    

    const dropdownChanged = e => {
        props.changed(e.target.value);

    }    

    return (
        <div className="col-sm-6 form-group row px-0" style={{width:'100%'}}>     
            {/* <label className="form-label col-sm-2" style={{fontSize:'large'}}>{props.label}</label>        */}
            <select value={props.selectedValue} onChange={dropdownChanged} style={{width:'100%',height:'40px',fontSize:'large',marginBottom:'12px'}}>
                <option key={0}>Select a Genre</option>
                {props.options.map((item, idx) => <option key={idx + 1} value={item}>{item}</option>)}
            </select>            
        </div>
    );
}

export default Dropdown;