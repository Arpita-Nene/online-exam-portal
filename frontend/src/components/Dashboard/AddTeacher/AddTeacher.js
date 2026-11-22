// import React from "react"
// import { connect } from "react-redux";
// import { Link, Navigate } from "react-router-dom";
// import Alert from "../../../services/alert";
// import Auth from "../../../services/Auth";
// import { getAdminDetails } from "../../../redux/actions/loginAction";
// import "./AddTeacher.css"
// import axios from "axios";
// import apis from "../../../services/Apis";

// class AddTeacher extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       name : "",
//       email : "",
//       password : "",
//       confirmpassword : ""
//     }
//   }

//   nameInputHandler = (event)=>{
//     this.setState({
//       ...this.state,
//       name : event.target.value
//     });
//   }

//   emailInputHandler = (event)=> {
//     this.setState({
//       ...this.state,
//       email : event.target.value
//     })
//   }

//   passwordInputHandler = (event)=> {
//     this.setState({
//       ...this.state,
//       password : event.target.value
//     })
//   }

//   confirmInputHandler = (event)=> {
//     this.setState({
//       ...this.state,
//       confirmpassword : event.target.value
//     })
//   }
  
//   handleSubmit= (event) => {
//     event.preventDefault();
//     if(this.state.confirmpassword !== this.state.password) {
//       Alert('error','Invalid Input','Confirm Password does not match')  
//     }
//     console.log(this.state);
//     axios.post(apis.BASE + apis.ADD_TEACHER, {
//       username : this.state.name,
//       email : this.state.email,
//       password : this.state.password
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
//         <h2>Add Teacher</h2>
//         <div>
//           <label> Name </label>
//           <input type='Text' value={this.state.name} onChange={this.nameInputHandler} required/>
//         </div>
//         <div>
//           <label> Email </label>
//           <input type='email' value={this.state.email} onChange={this.emailInputHandler} required/>
//         </div>
//         <div>
//           <label> Password </label>
//           <input type='password' value={this.state.password} onChange={this.passwordInputHandler} required/>
//         </div>
//         <div>
//           <label> Confirm Password </label>
//           <input type='password' value={this.state.confirmpassword} onChange={this.confirmInputHandler} required/>
//         </div>
//         <button type="submit"> Add Teacher</button>
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
// })(AddTeacher);


import React from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import Alert from "../../../services/alert";
import Auth from "../../../services/Auth";
import { getAdminDetails } from "../../../redux/actions/loginAction";
import "./AddTeacher.css";
import axios from "axios";
import apis from "../../../services/Apis";

class AddTeacher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      confirmpassword: ""
    };
  }

  nameInputHandler = (event) => {
    this.setState({ name: event.target.value });
  };

  emailInputHandler = (event) => {
    this.setState({ email: event.target.value });
  };

  passwordInputHandler = (event) => {
    this.setState({ password: event.target.value });
  };

  confirmInputHandler = (event) => {
    this.setState({ confirmpassword: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.confirmpassword !== this.state.password) {
      Alert("error", "Invalid Input", "Confirm Password does not match");
      return;
    }

    axios.post(
      apis.BASE + apis.ADD_TEACHER,
      {
        username: this.state.name,
        email: this.state.email,
        password: this.state.password
      },
      {
        headers: {
          Authorization: `Bearer ${Auth.retriveToken()}`
        }
      }
    ).then(response => {
      if (response.data.success) {
        Alert("info", "Success", response.data.message);
        this.setState({
          name: "",
          email: "",
          password: "",
          confirmpassword: ""
        });
      } else {
        Alert("error", "Failed", response.data.message);
      }
    }).catch(error => {
      Alert("error", "Failed", "Unable to add teacher. Please try again.");
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
      <div className="add-teacher-page">
        <form onSubmit={this.handleSubmit} className="add-teacher-card">
          <h2>Add New Teacher</h2>
          <p className="teacher-form-description">
            Enter the details to register a new teacher.
          </p>

          <div className="teacher-form-group">
            <label>Teacher Name</label>
            <input
              type="text"
              placeholder="Enter teacher name"
              value={this.state.name}
              onChange={this.nameInputHandler}
              required
            />
          </div>

          <div className="teacher-form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email address"
              value={this.state.email}
              onChange={this.emailInputHandler}
              required
            />
          </div>

          <div className="teacher-form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={this.state.password}
              onChange={this.passwordInputHandler}
              required
            />
          </div>

          <div className="teacher-form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={this.state.confirmpassword}
              onChange={this.confirmInputHandler}
              required
            />
          </div>

          <button type="submit" className="teacher-submit-btn">
            Add Teacher
          </button>

          <Link to="/home" className="teacher-back-link">
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
})(AddTeacher);
