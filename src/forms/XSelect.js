import React from 'react'
import Select from 'react-select'

/**
 * Select Input widget
 * Support simple static data 
 * options= [{ value: 'one', label: 'One' },...]
 * 
 * or A funtion that return an option array [{ value: 'one', label: 'One' },...]
 */
export default class XSelect extends React.Component {
  constructor(props) {
    super(props)
    const { options = [], remote } = this.props
    this.state = {
      options: remote ? [] : options,
      fetched: false
    }
  }

  componentDidMount() {
    const { remote, filter = {} } = this.props
    const { fetched } = this.state
    if (remote && !fetched) {
      remote(filter, options => {
        this.setState({ options, fetched: true })
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { remote, filter } = nextProps
    if (remote && filter !== this.props.filter) {
      remote(filter, options => {
        this.setState({ options })
      })
    }
  }

  render() {
    const { label, name, value, error, onChange, onTouched, multi = false } = this.props
    const { options = [] } = this.state
    return (
      <div className={error ? 'form-group has-error' : 'form-group'}>
        <label className="col-sm-2 control-label" htmlFor={name}>{label}</label>
        <div className="col-sm-5">
          <Select
            value={value || ''}
            options={options}
            onChange={val => {
              const value = multi ? val && val.map(i => i.value) : val
              onChange(value)
            }}
            onBlur={onTouched}
            placeholder={label}
            id={name}
            multi={multi}
            joinValues={true}
            simpleValue={true}
          />
        </div>
        <div className="col-sm-5 messages">
          {error && <p className="help-block error">{error}</p>}
        </div>
      </div>
    )
  }
}