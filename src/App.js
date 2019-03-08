import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import fetch from "node-fetch"
import Button from 'react-bootstrap/Button';
import "./main.css"

const link = "http://mep.re:8080/api/delegates"

let delegates = [];
const columns = [{
  dataField: "delid",
  text: "Id",
  style: {textAlign: "center", verticalAlign: "middle"}
}, {
  dataField: "delname",
  text: "Name",
  style: {textAlign: "center", verticalAlign: "middle"}
}, {
  dataField: "committee",
  text: "Committee",
  style: {textAlign: "center", verticalAlign: "middle"}
}, {
  dataField: "school",
  text: "School",
  style: {textAlign: "center", verticalAlign: "middle"}
}, {
  dataField: "speeches",
  text: "Speeches",
  style: {textAlign: "center", verticalAlign: "middle"}
}, {
  dataField: "button",
  text: "Modify Speeches",
  style: {textAlign: "center", verticalAlign: "middle"}
}];


export class App extends Component {

  constructor() {
    super()
    this.addSpeeches = this.addSpeeches.bind(this)
    this.removeCommission = this.removeCommission.bind(this)
    this.addCommission = this.addCommission.bind(this)
    this.removeSpeeches = this.removeSpeeches.bind(this)
    this.state = {
      removed: []
    }
  }

  render() {
      return (
        <div>
          {
            this.state.removed.length ?
            <div id="removed">
              {
                  this.state.removed.map(e => <Button className="modCommission" key={e} onClick={() => this.addCommission(e)}>{e}</Button>)
              }
            </div>
            :
            (<div />)
        }
          <BootstrapTable keyField="index" data={ delegates.filter(({nCommission}) => !this.state.removed.includes(nCommission)) } columns={ columns } id="myTable"/>
        </div>
      )
  }

  addSpeeches(committee, id, nSchool) {
    console.log(`committee: ${committee}, id: ${id}, school: ${nSchool}`)
    fetch("http://mep.re:8080/api/add", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({
        ide: id,
        committee,
        school: nSchool
      })
    })
      .then(res => res.json( ))
      .then(data => {
        console.log(data)
        this.forceUpdate()
      })
      .catch(err => {
        console.log("errore:", err)
      })
  }

  removeSpeeches(committee, id, nSchool) {
    fetch("http://mep.re:8080/api/rm", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({
        ide: id,
        committee,
        school: nSchool
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.forceUpdate()
      })
      .catch(err => {
        console.log("errore:", err)
      })
  }

  removeCommission(nCommission) {
    this.setState((prevState) => {
      return {removed: [...prevState.removed, nCommission]}
    })
  }

  addCommission(nCommission) {
    this.state.removed.splice(this.state.removed.indexOf(nCommission), 1)
    this.forceUpdate()
  }

  componentDidMount() {

        fetch(link, {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token")
          }
        })
          .then(res => res.json())
          .then(data => {
            data.forEach((e, i) => {
              e.button = (
                <div>
                  <Button onClick={() => this.addSpeeches(e.nCommission, e.delid, e.sid)} className="modSpeeches"><h1 style={{margin:"0px", lineHeight: "10px"}}>+</h1></Button>
                  <Button onClick={() => this.removeSpeeches(e.nCommission, e.delid, e.sid)} className="modSpeeches" style={{backgroundColor:"red"}}><h1 style={{margin:"-8px", lineHeight: "10px"}}>-</h1></Button>
                </div>
              )
              e.index = i
              e.nCommission = e.committee
              e.committee = <Button className="modCommission" onClick={() => this.removeCommission(e.nCommission)}>{e.nCommission}</Button>
            })
            delegates=[...delegates, ...data]
            this.forceUpdate()
          })
          .catch(err => {
            console.log(err.message)
          })
  }
}

export default App;
