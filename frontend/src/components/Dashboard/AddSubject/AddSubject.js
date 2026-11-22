// import React from "react"
// import { connect } from "react-redux";
// import { Link, Navigate } from "react-router-dom";
// import Alert from "../../../services/alert";
// import Auth from "../../../services/Auth";
// import { getAdminDetails } from "../../../redux/actions/loginAction";
// import "./AddSubject.css"
// import axios from "axios";
// import apis from "../../../services/Apis";

// class AddSubject extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       name : ""
//     }
//   }

//   nameInputHandler = (event)=>{
//     this.setState({
//       ...this.state,
//       name : event.target.value
//     });
//   }

  
  
//   handleSubmit= (event) => {
//     event.preventDefault();
    
//     console.log(this.state);
//     axios.post(apis.BASE + apis.ADD_SUBJECT, {
//       name : this.state.name
//     },{
//       headers:{
//         'Authorization':`Bearer ${Auth.retriveToken()}`
//       }
//     }).then(response => {
//       console.log(response.data);
//       if(response.data.success) {
//         Alert('info','Success',response.data.message);
//       } else {
//         Alert('error','Failed',response.data.message);
//       }
//     })
//   }

//   render(){
//     if(!Auth.retriveToken() || Auth.retriveToken()==='undefined'){
//       return (<Navigate to='/'/>);
//     } else if(!this.props.user.isLoggedIn) {
//       this.props.getAdminDetails();
//       return (<div></div>)
//     }
//     return (
      
//       <form onSubmit={this.handleSubmit} className="form-class">
//         <h2>Add Subject</h2>
//         <div>
//           <label> Name </label>
//           <input type='Text' value={this.state.name} onChange={this.nameInputHandler} required/>
//         </div>
        
//         <button type="submit"> Add Subject</button>
//         <br/>
//         <button> <Link className="linkbtn" to='/home'>back</Link></button>
//       </form>
//     )
//   }
// }

// const mapStateToProps = state => ({
//   user:state.user
// });

// export default connect(mapStateToProps,{
//   getAdminDetails
// })(AddSubject);

import React from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import Alert from "../../../services/alert";
import Auth from "../../../services/Auth";
import { getAdminDetails } from "../../../redux/actions/loginAction";
import "./AddSubject.css";
import axios from "axios";
import apis from "../../../services/Apis";

class AddSubject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  nameInputHandler = (event) => {
    this.setState({
      name: event.target.value
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    axios.post(
      apis.BASE + apis.ADD_SUBJECT,
      {
        name: this.state.name
      },
      {
        headers: {
          Authorization: `Bearer ${Auth.retriveToken()}`
        }
      }
    ).then(response => {
      if (response.data.success) {
        Alert("info", "Success", response.data.message);
        this.setState({ name: "" });
      } else {
        Alert("error", "Failed", response.data.message);
      }
    }).catch(error => {
      Alert("error", "Failed", "Unable to add subject. Please try again.");
    });
  };

  render() {
    if (!Auth.retriveToken() || Auth.retriveToken() === "undefined") {
      return <Navigate to="/" />;
    } else if (!this.props.user.isLoggedIn) {
      this.props.getAdminDetails();
      return <div></div>;
    }

    return (
      <div className="add-subject-page">
        <form onSubmit={this.handleSubmit} className="add-subject-card">
          <h2>Add New Subject</h2>
          <p className="form-description">
            Enter the details to create a new subject.
          </p>

          <div className="subject-form-group">
            <label>Subject Name</label>
            <input
              type="text"
              placeholder="Enter subject name"
              value={this.state.name}
              onChange={this.nameInputHandler}
              required
            />
          </div>

          <button type="submit" className="subject-submit-btn">
            Add Subject
          </button>

          <Link to="/home" className="subject-back-link">
            Back to Dashboard
          </Link>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, {
  getAdminDetails
})(AddSubject);
