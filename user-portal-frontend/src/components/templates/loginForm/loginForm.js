// import React from "react";
// import TextField from "@material-ui/core/TextField";
// import './loginForm.css';
// import Button from "@material-ui/core/Button";
// import { withStyles } from "@material-ui/core/styles";
// import { loginRequestAction } from "../../../redux/actions/loginAction";
// import { connect } from "react-redux";

// // const useStyles = ()=>({
// //   inputfield : {
// //     display:'block',
// //     margin :'20px'
// //   },
// //   loginbtn : {
// //     margin : '0px 40px'
// //   }
// // })
// const useStyles = () => ({
//   inputfield: {
//     display: 'block',
//     width: '100%',
//     margin: '14px 0',
//   },

//   loginbtn: {
//     width: '100%',
//     margin: '15px 0 0',
//   }
// });

// class LoginForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       email : "",
//       password : ""
//     }
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

//   handleSubmit(event) {
//     event.preventDefault();
//     this.props.loginRequestAction(this.state);
//   }

//   render() {
//     return (
//       <form className="form-class"  onSubmit={(event)=>(this.handleSubmit(event))}>
//         <div className="form-title" color="primary">LOGIN</div>
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
//           autoComplete="username"
//             InputLabelProps={{ shrink: true }}
//         />
//         <TextField
//           variant='outlined'
//           color="primary"
//           label="Password"
//           className={this.props.classes.inputfield}
//           placeholder='enter password'
//           type='password'
//           error_text=''
//           value={this.state.password}
//           onChange={(event)=>(this.passwordInputHandler(event))}
//           required
//           autoComplete="current-password"
//           InputLabelProps={{ shrink: true }}
//         />
//         <Button 
//           variant='contained'
//           color="primary"
//           type='submit'
//           className={this.props.classes.loginbtn}
//         >
//           Login
//         </Button>
//       </form>
//     )
//   }
// }

// const mapStatetoProps = state => ({
//   state : state.user
// })

// export default withStyles(useStyles)(connect(mapStatetoProps,{
//   loginRequestAction
// })(LoginForm));



import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { loginRequestAction } from "../../../redux/actions/loginAction";
import { connect } from "react-redux";

// UPDATED: Login form styling
const useStyles = () => ({
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
  },

  // UPDATED: Labels placed above input boxes
  fieldLabel: {
    display: "block",
    color: "#cccccc",
    textAlign: "left",
    fontSize: "14px",
    marginBottom: "7px",
    fontWeight: 500,
  },

  // UPDATED: Complete input box borders and text colors
  inputfield: {
    display: "block",
    width: "100%",
    margin: "0 0 18px",

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

    // UPDATED: Browser autofill text visibility
    "& input:-webkit-autofill": {
      WebkitTextFillColor: "#ffffff",
      transition: "background-color 5000s ease-in-out 0s",
    },
  },

  // UPDATED: Login heading
  formTitle: {
    fontSize: "1.9em",
    fontWeight: 600,
    color: "#07cfda",
    marginBottom: "25px",
  },

  // UPDATED: Login button
  loginbtn: {
    width: "100%",
    margin: "10px 0 0",
    padding: "12px",
    backgroundColor: "#07cfda",
    color: "#141e30",
    fontWeight: 600,
    fontSize: "1rem",

    "&:hover": {
      backgroundColor: "#05b5bf",
    },
  },
});

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

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

  handleSubmit(event) {
    event.preventDefault();
    this.props.loginRequestAction(this.state);
  }

  render() {
    const classes = this.props.classes;

    return (
      <form
        className={classes.formClass}
        onSubmit={(event) => this.handleSubmit(event)}
      >
        <div className={classes.formTitle}>
          LOGIN
        </div>

        {/* UPDATED: Email label outside the input box */}
        <div className={classes.fieldLabel}>
          Email *
        </div>

        <TextField
          variant="outlined"
          className={classes.inputfield}
          type="email"
          value={this.state.email}
          onChange={this.emailInputHandler}
          required
          fullWidth
          autoComplete="username"
        />

        {/* UPDATED: Password label outside the input box */}
        <div className={classes.fieldLabel}>
          Password *
        </div>

        <TextField
          variant="outlined"
          className={classes.inputfield}
          type="password"
          value={this.state.password}
          onChange={this.passwordInputHandler}
          required
          fullWidth
          autoComplete="current-password"
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.loginbtn}
        >
          Login
        </Button>
      </form>
    );
  }
}

const mapStatetoProps = (state) => ({
  state: state.user,
});

export default withStyles(useStyles)(
  connect(mapStatetoProps, {
    loginRequestAction,
  })(LoginForm)
);

