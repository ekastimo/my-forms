import React from 'react'
import Datetime from 'react-datetime'

export default class XDatetime extends React.Component {
  render() {
    const { label, name, type, value, error, onChange, onTouched, hasTime } = this.props
    return (
      <div className={error ? 'form-group has-error' : 'form-group'}>
        <label className="col-sm-2 control-label" htmlFor={name}>{label}</label>
        <div className="col-sm-5">
          <Datetime
            id={name}
            type={type}
            placeholder={label}
            name={name}
            value={value || ''}
            onChange={mom => {
              if (typeof mom === "string")
                onChange(undefined)
              else
                onChange(mom.toDate())
            }}
            onBlur={onTouched}
            timeFormat={hasTime}
          />
        </div>
        <div className="col-sm-5 messages">
          {error && <p className="help-block error">{error[0]}</p>}
        </div>
      </div>
    )
  }
}