import React from 'react'
export default class XFile extends React.Component {
    constructor(props) {
        super(props)
        const { value } = props
        this.state = {
            editing: !value || value.length <= 0,
        }

    }
    render() {
        const { label, name, type, value, error, onTouched } = this.props
        const { editing } = this.state
        const hasValue = value && value.length > 0;
        return (
            <div className={error ? 'form-group has-error' : 'form-group'}>
                <label className="col-sm-2 control-label" htmlFor={name}>{label}</label>
                <div className="col-sm-5">
                    {
                        !editing && <div className="input-group">
                            <input type="text" className="form-control" value={value || 'upload'} onChange={() => { }} />
                            <div className="input-group-btn">
                                <button className="btn btn-default" type="button" onClick={this._updateFile.bind(this)}>
                                    <i className="glyphicon glyphicon-edit"></i>
                                </button>
                            </div>
                        </div>
                    }
                    {
                        editing && <div className="input-group">
                            <input className="form-control"
                                id={name}
                                type={type}
                                placeholder={label}
                                name={name}
                                onChange={this._handleFileUpload.bind(this)}
                                onBlur={onTouched}
                            />
                            {
                                hasValue && <div className="input-group-btn">
                                    <button className="btn btn-default" type="button" onClick={this._stopUpdate.bind(this)}>
                                        <i className="glyphicon glyphicon-share-alt"></i>
                                    </button>
                                </div>
                            }

                        </div>
                    }
                </div>
                <div className="col-sm-5 messages">
                    {error && <p className="help-block error">{error[0]}</p>}
                </div>
            </div>
        )
    }

    _handleFileUpload(event) {
        const { label, onChange, remote } = this.props
        const file = event.target.files[0]
        let formData = new FormData()
        formData.append('file', file)
        formData.append('name', label)
        remote(formData, res => {
            const { file } = res
            onChange(file)
            this.setState({ editing: false })
        })
    }

    _updateFile() {
        this.setState({ editing: true })
    }

    _stopUpdate(){
        this.setState({ editing: false })
    }
}