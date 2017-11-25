import React, { Component } from 'react'
import moment from 'moment'

import XInput from './XInput'
import XSelect from './XSelect'
import XDatetime from './XDatetime'
import XFile from './XFile'
import XCheckBox from './XCheckBox'

import { types } from './itemTypes'
const validate = require('validate.js')


validate.extend(validate.validators.datetime, {
  // The value is guaranteed not to be null or undefined but otherwise it
  // could be anything.
  parse: function (value, options) {
    return +moment.utc(value)
  },
  // Input is a unix timestamp
  format: function (value, options) {
    const format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss'
    return moment.utc(value).format(format)
  }
})

class XForm extends Component {
  constructor(props) {
    super(props)
    const { items, data } = props
    this.state = {
      data: { ...data },
      errors: {},
      touched: {},
    }
    this.rulesConf = {}
    items.forEach(({ name, rule }) => {
      this.rulesConf[name] = rule
    })
  }

  /**
   * 
   * @param {string} name the name of the chnaged field
   * @param {object} e - The new value
   */
  _onChange(name, value) {
    console.log("On change")
    const data = { ...this.state.data }
    data[name] = value

    if (this.state.touched[name]) {
      const errors = this._validate(name, data)
      this.setState({ data, errors })
    } else {
      this.setState({ data })
    }
  }

  /**
  * Validate all the fields, called when submiting
  */
  _validateAll() {
    console.log("Validating all fields")
    const { items } = this.props
    const { data } = this.state
    const errors = {}
    const touched = {}
    items.forEach(({ name }) => {
      const fieldErrors = this._validate(name, data)
      Object.assign(errors, fieldErrors)
      touched[name] = true
    })
    this.setState({ errors, touched })
    return errors
  }

  _onTouched(name) {
    const errors = this._validate(name, this.state.data)
    const touched = { ...this.state.touched }
    touched[name] = true
    this.setState({ touched, errors })
  }

  /**
   * We pass all the data just in case the field depend on any other fields, eg password validation
   * @param {string} name - The name of the field
   * @param {object} data - All the data availble
   */
  _validate(name, data) {
    const value = data[name]
    const errors = { ...this.state.errors }
    const rules = this.rulesConf[name]
    if (!rules)
      return errors

    if (rules.equality) {
      const constraints = {}
      constraints[name] = rules
      const resp = validate(data, constraints)
      errors[name] = resp ? resp[name] : resp
    } else
      errors[name] = validate.single(value, rules)
    return errors
  }

  _doSubmit() {
    const errors = this._validateAll()
    const errorsArray = Object.keys(errors).filter(key => errors.hasOwnProperty(key) && errors[key])
    if (errorsArray.length > 0) {
      console.log('Errors', errorsArray)
    } else {
      const { doSubmit } = this.props
      const { data } = this.state
      doSubmit(data)
    }
  }

  render() {
    const { addSubmit = true, items } = this.props
    return (
      <form id="main" className="form-horizontal" action="#" method="post" noValidate>
        {
          items.map(({ type, name, label, rule, options, remote }) => {
            const params = {
              key: name,
              type, name, label, rule,
              value: this.state.data[name],
              error: this.state.errors[name],
              onChange: this._onChange.bind(this, name),
              onTouched: this._onTouched.bind(this, name)
            }
            if (type === types.select)
              return <XSelect
                {...params}
                options={options}
                remote={remote}
              />
            else if (type === types.date)
              return <XDatetime
                {...params}
                hasTime={false}
              />
            else if (type === types.datetime)
              return <XDatetime
                {...params}
                hasTime={true}
              />
            else if (type === types.file)
              return <XFile
                {...params}
                remote={remote}
              />
            else if (type === types.checkbox)
              return <XCheckBox
                {...params}
              />
            return <XInput {...params} />
          })
        }
        {
          addSubmit &&
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="button" className="btn btn-default" onClick={this._doSubmit.bind(this)}>Submit</button>
            </div>
          </div>
        }
      </form>
    )
  }
}

export default XForm
