import React from 'react'

export default class XCheckBox extends React.Component {
    render() {
        const { label, name, type, value, error, onChange, onTouched } = this.props
        return (
            <div className={error ? 'form-group has-error' : 'form-group'}>
                <label className="col-sm-2 control-label" htmlFor={name}>{label}</label>
                <div className="col-sm-5">
                    <div className="checkbox">
                        <label>
                            <Cb
                                value={value}
                                onChange={onChange}
                                onBlur={onTouched}
                            />
                        </label>
                    </div>
                </div>
                <div className="col-sm-5 messages">
                    {error && <p className="help-block error">{error[0]}</p>}
                </div>
            </div>
        )
    }
}

class Cb extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: false
        }
    }
    render() {
        const { onChange, onTouched } = this.props
        const { value } = this.state
        return <input type="checkbox"
            value={value}
            checked={value}
            onBlur={onTouched}
            onChange={e => {
                const newValue = !value
                this.setState({ value: newValue })
                onChange(newValue)
            }}
        />
    }
}