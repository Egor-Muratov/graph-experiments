import React, { Component, useEffect, useRef } from 'react';

export function GraphParamControl(props) {
    const FormRef = useRef(null);
    return (
        /* <form className="col-sm input-group" onSubmit={this.addNodeBind}>
          <input
            value={this.state.name}
            onChange={this.handleAddNodeBind}
            type="text"
            name="name"
            className="form-control"
            id="name"
            placeholder="Имя ноды" 
            aria-label="Имя ноды"
            disabled={this.state.loading} 
            aria-describedby="button-addon1"/>
          <input className="btn btn-outline-secondary" id='button-addon1' type="submit" value="Добавить ноду" disabled={this.state.loading} />
        </form> */

        <div className="input-group" ref={FormRef}>
            <span className="input-group-text">Количество нод</span>
            <input value={props.nodesCount} name="nodesCount" type="text" aria-label="Количество нод" className="form-control" onChange={props.handleInputBind} />
            <span className="input-group-text">Связи, c</span>
            <input value={props.minLinks} name="minLinks" type="text" aria-label="Связи, c" className="form-control" onChange={props.handleInputBind} />
            <span className="input-group-text"> по</span>
            <input value={props.maxLinks} name="maxLinks" type="text" aria-label=" по" className="form-control" onChange={props.handleInputBind} />
            <button className="btn btn-outline-secondary" type="button" onClick={props.getNewGraphBind}>Обновить</button>
        </div>
    );
}

export function GraphOrderControl({name, value, label,...props}) {
    const FormRef = useRef(null);
    return (
        <div ref={FormRef} className="input-group">
            <label htmlFor={name} className="form-label">{label}: {value}</label>
            <input value={value}
                name={name}
                type="range"
                className="form-range"
                min="0"
                id={name}
                {...props} />
        </div>
    );
}