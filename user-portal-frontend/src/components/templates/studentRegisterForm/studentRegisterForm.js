// import React from "react";
// import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
// import { withStyles } from "@material-ui/core/styles";
// import { registerStudentAction } from "../../../redux/actions/registerStudentAction";
// import { connect } from "react-redux";
// import { setAlert } from "../../../redux/actions/alertAction";

// // const useStyles = ()=>({
// //   inputfield : {
// //     display:'block',
// //     margin :'20px'
// //   },
// //   btn : {
// //     margin : '0px 40px'
// //   },
// //   formClass : {
// //     margin:'20px',
// //     display: 'inline-block',
// //     textAlign : 'center',
// //     border : '1px solid black',
// //     borderRadius: '10px',
// //     padding : '20px'
// //   },
  
// //   formTitle:{
// //     fontSize: '1.7em'
// //   }
// // })
// // ----------

// // const useStyles = () => ({
// //   inputfield: {
// //     display: 'block',
// //     width: '100%',
// //     margin: '12px 0',
// //   },

// //   btn: {
// //     width: '100%',
// //     margin: '15px 0 0',
// //     padding: '10px',
// //     backgroundColor: '#07cfda',
// //     color: '#141e30',
// //     fontWeight: 600,
// //     '&:hover': {
// //       backgroundColor: '#05b5bf',
// //     },
// //   },

// //   formClass: {
// //     width: '100%',
// //     maxWidth: '420px',
// //     margin: 0,
// //     padding: '30px 35px',
// //     display: 'block',
// //     textAlign: 'center',
// //     background: 'rgba(0, 0, 0, 0.5)',
// //     border: '1px solid rgba(7, 207, 218, 0.45)',
// //     borderRadius: '10px',
// //     boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',

// //     '& .MuiFormControl-root': {
// //       width: '100%',
// //       margin: '12px 0',
// //     },

// //     '& .MuiOutlinedInput-root': {
// //       color: '#f1eee6',
// //     },

// //     '& .MuiInputLabel-outlined': {
// //       color: '#c5cbd3',
// //     },

// //     '& .MuiOutlinedInput-notchedOutline': {
// //       borderColor: '#64758a',
// //     },

// //     '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
// //       borderColor: '#07cfda',
// //     },

// //     '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
// //       borderColor: '#07cfda',
// //     },

// //     '& .MuiInputLabel-outlined.Mui-focused': {
// //       color: '#07cfda',
// //     },
// //   },

// //   formTitle: {
// //     fontSize: '1.7em',
// //     fontWeight: 600,
// //     color: '#07cfda',
// //     marginBottom: '25px',
// //   },
// // });

// const useStyles = () => ({
//   inputfield: {
//     display: 'block',
//     width: '100%',
//     margin: '14px 0',
//   },

//   btn: {
//     width: '100%',
//     margin: '15px 0 0',
//     padding: '10px',
//     backgroundColor: '#07cfda',
//     color: '#141e30',
//     fontWeight: 600,
//     '&:hover': {
//       backgroundColor: '#05b5bf',
//     },
//   },

//   formClass: {
//     width: '100%',
//     maxWidth: '420px',
//     margin: 0,
//     padding: '30px 35px',
//     display: 'block',
//     textAlign: 'center',
//     background: 'rgba(0, 0, 0, 0.5)',
//     border: '1px solid rgba(7, 207, 218, 0.45)',
//     borderRadius: '10px',
//     boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
//   },

//   formTitle: {
//     fontSize: '1.7em',
//     fontWeight: 600,
//     color: '#07cfda',
//     marginBottom: '20px',
//   },
// });

// class StudentRegisterForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       username : "",
//       email : "",
//       password : "",
//       confirmPassword : ""
//     }
//   }

//   usernameInputHandler = (event) => {
//     this.setState({
//       ...this.state,
//       username : event.target.value
//     });
//   }

//   emailInputHandler = (event) => {
//     this.setState({
//       ...this.state,
//       email : event.target.value
//     });
//   }

//   passwordInputHandler = (event) => {
//     this.setState({
//       ...this.state,
//       password : event.target.value
//     });
//   }

//   confirmpasswordInputHandler = (event) => {
//     this.setState({
//       ...this.state,
//       confirmPassword : event.target.value
//     });
//   }

//   handleSubmit(event) {
//     event.preventDefault();
//     if(this.state.confirmPassword !== this.state.password) {
//       this.props.setAlert({
//         isAlert:false,
//         type:"error",
//         title:'Invalid Input',
//         message : 'Confirm Password does not match',
//       })  
//       return;
//     }
//     this.props.registerStudentAction({
//       username : this.state.username,
//       email : this.state.email,
//       password : this.state.password
//     });
//   }

//   render() {
//     return (
//       <form className={this.props.classes.formClass} onSubmit={(event)=>(this.handleSubmit(event))}>
//         <div className={this.props.classes.formTitle} color="primary">Register</div>
//         <TextField
//           variant='outlined'
//           color="primary"
//           className={this.props.classes.inputfield}
//           label="Username"
//           // placeholder='enter username'
//           type='text'
//           error_text=''
//           value={this.state.username}
//           onChange={(event)=>(this.usernameInputHandler(event))}
//           required
//           InputLabelProps={{ shrink: true }}
//         />
//         <TextField
//           variant='outlined'
//           color="primary"
//           className={this.props.classes.inputfield}
//           label="Email"
//           // placeholder='enter email'
//           type='email'
//           error_text=''
//           value={this.state.email}
//           onChange={(event)=>(this.emailInputHandler(event))}
//           required
//           InputLabelProps={{ shrink: true }}
//         />
//         <TextField
//           variant='outlined'
//           color="primary"
//           label="Password"
//           className={this.props.classes.inputfield}
//           // placeholder='enter password'
//           type='password'
//           error_text=''
//           value={this.state.password}
//           onChange={(event)=>(this.passwordInputHandler(event))}
//           required
//           InputLabelProps={{ shrink: true }}
//         />
//         <TextField
//           variant='outlined'
//           color="primary"
//           label="Confirm Password"
//           className={this.props.classes.inputfield}
//           // placeholder='enter password again'
//           type='password'
//           error_text=''
//           value={this.state.confirmPassword}
//           onChange={(event)=>(this.confirmpasswordInputHandler(event))}
//           required
//           InputLabelProps={{ shrink: true }}
//         />
//         <Button 
//           variant='contained'
//           color="primary"
//           type='submit'
//           className={this.props.classes.btn}
//         >
//           Register
//         </Button>
//       </form>
//     )
//   }
// }

// const mapStatetoProps = state => ({

// })

// export default withStyles(useStyles)(connect(mapStatetoProps,{
//   registerStudentAction,
//   setAlert
// })(StudentRegisterForm));



import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { registerStudentAction } from "../../../redux/actions/registerStudentAction";
import { connect } from "react-redux";
import { setAlert } from "../../../redux/actions/alertAction";

const useStyles = () => ({
  // UPDATED: Registration input spacing
  inputfield: {
    display: "block",
    width: "100%",
    margin: "16px 0",
  },

  // UPDATED: Register button styling
  btn: {
    width: "100%",
    margin: "20px 0 0",
    padding: "12px",
    backgroundColor: "#07cfda",
    color: "#141e30",
    fontWeight: 600,
    fontSize: "1rem",

    "&:hover": {
      backgroundColor: "#05b5bf",
    },
  },

  // UPDATED: Form background, size and input visibility
  formClass: {
    width: "100%",
    maxWidth: "480px",
    margin: "20px auto",
    padding: "30px 35px",
    display: "block",
    boxSizing: "border-box",
    textAlign: "center",

    background: "rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(7, 207, 218, 0.45)",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",

    // UPDATED: Typed input text color
    "& .MuiInputBase-input": {
      color: "#ffffff",
    },

    // UPDATED: Input label color
    "& .MuiInputLabel-outlined": {
      color: "#cccccc",
    },

    // UPDATED: Focused label color
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "#07cfda",
    },

    // UPDATED: Normal input border
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#64758a",
    },

    // UPDATED: Hover border
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#07cfda",
    },

    // UPDATED: Focused input border
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#07cfda",
    },

    // UPDATED: Browser autofill text visibility
    "& input:-webkit-autofill": {
      WebkitTextFillColor: "#ffffff",
      transition: "background-color 5000s ease-in-out 0s",
    },
  },

  // UPDATED: Register heading
  formTitle: {
    fontSize: "1.9em",
    fontWeight: 600,
    color: "#07cfda",
    marginBottom: "25px",
  },

  // UPDATED: Labels placed completely above the input boxes
fieldLabel: {
  display: "block",
  color: "#cccccc",
  textAlign: "left",
  fontSize: "14px",
  marginBottom: "7px",
  fontWeight: 500,
},

// UPDATED: Complete input box border
inputfield: {
  display: "block",
  width: "100%",
  margin: "0 0 16px",

  "& .MuiInputBase-input": {
    color: "#ffffff",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#64758a",
  },

  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#07cfda",
  },

  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#07cfda",
  },
},
});



class StudentRegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  }

  usernameInputHandler = (event) => {
    this.setState({
      ...this.state,
      username: event.target.value,
    });
  };

  emailInputHandler = (event) => {
    this.setState({
      ...this.state,
      email: event.target.value,
    });
  };

  passwordInputHandler = (event) => {
    this.setState({
      ...this.state,
      password: event.target.value,
    });
  };

  confirmpasswordInputHandler = (event) => {
    this.setState({
      ...this.state,
      confirmPassword: event.target.value,
    });
  };

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.confirmPassword !== this.state.password) {
      this.props.setAlert({
        isAlert: false,
        type: "error",
        title: "Invalid Input",
        message: "Confirm Password does not match",
      });

      return;
    }

    this.props.registerStudentAction({
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    });
  }

  render() {
    return (
      <form
        className={this.props.classes.formClass}
        onSubmit={(event) => this.handleSubmit(event)}
      >
        <div className={this.props.classes.formTitle}>
          Register
        </div>

        {/* <TextField
          variant="outlined"
          color="primary"
          className={this.props.classes.inputfield}
          label="Username"
          type="text"
          value={this.state.username}
          onChange={this.usernameInputHandler}
          required
          autoComplete="username"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          variant="outlined"
          color="primary"
          className={this.props.classes.inputfield}
          label="Email"
          type="email"
          value={this.state.email}
          onChange={this.emailInputHandler}
          required
          autoComplete="email"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          variant="outlined"
          color="primary"
          label="Password"
          className={this.props.classes.inputfield}
          type="password"
          value={this.state.password}
          onChange={this.passwordInputHandler}
          required
          autoComplete="new-password"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          variant="outlined"
          color="primary"
          label="Confirm Password"
          className={this.props.classes.inputfield}
          type="password"
          value={this.state.confirmPassword}
          onChange={this.confirmpasswordInputHandler}
          required
          autoComplete="new-password"
          InputLabelProps={{ shrink: true }}
        /> */}

        {/* UPDATED: Username label outside the box */}
<div className={this.props.classes.fieldLabel}>Username *</div>
<TextField
  variant="outlined"
  className={this.props.classes.inputfield}
  type="text"
  value={this.state.username}
  onChange={this.usernameInputHandler}
  required
  fullWidth
  autoComplete="username"
/>

{/* UPDATED: Email label outside the box */}
<div className={this.props.classes.fieldLabel}>Email *</div>
<TextField
  variant="outlined"
  className={this.props.classes.inputfield}
  type="email"
  value={this.state.email}
  onChange={this.emailInputHandler}
  required
  fullWidth
  autoComplete="email"
/>

{/* UPDATED: Password label outside the box */}
<div className={this.props.classes.fieldLabel}>Password *</div>
<TextField
  variant="outlined"
  className={this.props.classes.inputfield}
  type="password"
  value={this.state.password}
  onChange={this.passwordInputHandler}
  required
  fullWidth
  autoComplete="new-password"
/>

{/* UPDATED: Confirm Password label outside the box */}
<div className={this.props.classes.fieldLabel}>Confirm Password *</div>
<TextField
  variant="outlined"
  className={this.props.classes.inputfield}
  type="password"
  value={this.state.confirmPassword}
  onChange={this.confirmpasswordInputHandler}
  required
  fullWidth
  autoComplete="new-password"
/>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={this.props.classes.btn}
        >
          Register
        </Button>
      </form>
    );
  }
}

const mapStatetoProps = (state) => ({});

export default withStyles(useStyles)(
  connect(mapStatetoProps, {
    registerStudentAction,
    setAlert,
  })(StudentRegisterForm)
);
