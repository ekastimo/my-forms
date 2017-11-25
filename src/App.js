import React, { Component } from 'react'
import superagent from 'superagent'
import XForm from './forms/XForm'
import rules from './forms/rules'
import { types } from './forms/itemTypes';


const xget = (url, callBack) => {
  superagent.get(url)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      console.log("On response request")
      if (err || !res.ok) {
        console.log(err)
      } else {
        callBack(res.body)
      }
    })
}

const xpost = (url, callBack) => {
  superagent.post(url)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      console.log("On response request")
      if (err || !res.ok) {
        console.log(err)
      } else {
        callBack(res.body)
      }
    })
}

const items = [
  {
    type: types.email, name: 'email', label: 'Email', rule: rules.email
  },
  {
    type: types.password, name: 'password', label: 'Password', rule: rules.password
  },
  {
    type: types.password, name: 'confirmPassword', label: 'Confirm-password', rule: rules.confirmPassword
  },
  {
    type: types.select, name: 'gender', label: 'Gender', rule: rules.required, options: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }]
  },
  {
    type: 'select', name: 'user', label: 'User', rule: rules.required,
    remote: (filter, cb) => {
      const url = "https://jsonplaceholder.typicode.com/posts?userId=1"
      xget(url, (data = []) => {
        const options = data.map(({ title, id }) => {
          return { value: id, label: title.substring(0, 10) }
        })
        cb(options)
      })
    }
  },
  {
    type: types.date, name: 'birthDate', label: 'Date Of Birth', rule: rules.required,
  },
  {
    type: types.datetime, name: 'expectation', label: 'Expectation', rule: rules.required,
  },
  {
    type: types.file, name: 'photo', label: 'Photo', rule: rules.required,
    remote: (data, callBack) => {
      //TODO make actual call to server
      callBack({ file: "filename.ext" })
    }
  },
  {
    type: types.checkbox, name: 'awesome', label: 'Awesome'
  },
]

class App extends Component {
  state = {
    data: {}
  }

  doSubmit(data) {
    alert(JSON.stringify(data))
  }

  handleFileUpload(event) {
    const file = event.target.files[0]
    let formData = new FormData()
    formData.append('file', file)
    formData.append('name', 'My File')
    console.log("Sending request")
    superagent.post('http://localhost:8080/files/add')
      .set('Accept', 'application/json')
      .send(formData)
      .end(function (err, response) {
        console.log("On response request")
        if (err) {
          console.log(err)
        } else {
          console.log(response)
        }
      })
  }

  render() {
    return (
      <div className="container">
        <h4>Hello World</h4>
        <XForm items={items} data={this.state.data} doSubmit={this.doSubmit.bind(this)} />

      </div>
    )
  }
}



export default App
