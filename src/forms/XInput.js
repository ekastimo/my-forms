import React from 'react'

export default class XInput extends React.Component {
  render() {
    const { label, name, type, value, error, onChange, onTouched } = this.props
    return (
      <div className={error ? 'form-group has-error' : 'form-group'}>
        <label className="col-sm-2 control-label" htmlFor={name}>{label}</label>
        <div className="col-sm-5">
          <input className="form-control"
            id={name}
            type={type}
            placeholder={label}
            name={name}
            value={value || ''}
            onChange={e => { onChange(e.target.value) }}
            onBlur={onTouched}
          />
        </div>
        <div className="col-sm-5 messages">
          {error && <p className="help-block error">{error[0]}</p>}
        </div>
      </div>
    )
  }
}