// import { withStyles } from "@material-ui/styles";
// import React from "react";
// import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
// import { connect } from "react-redux";
// import { FormControlLabel, FormGroup, FormLabel, Checkbox } from "@material-ui/core";
// import { getSubjectDetails } from '../../../redux/actions/subjectAction';
// import { setAlert } from "../../../redux/actions/alertAction";
// import { createTestAction } from "../../../redux/actions/teacherTestAction";

// const useStyles = ()=>({
//   questionInput:{
//     marginTop:'20px',
//     display : 'block'
//   },
//   optionInput : {
//     display:'inline-block',
//     margin :'20px 20px 0px'
//   },
//   inputfield : {
//     display : 'block',
//     margin : '10px 20px 0px'
//   },
//   btn : {
//     margin : '20px 40px',
//     display:'inline-block'
//   },
//   formClass : {
//     margin:'20px',
//     display: 'inline-block',
//     textAlign : 'center',
//     border : '1px solid black',
//     borderRadius: '10px',
//     padding : '20px'
//   },
  
//   formTitle:{
//     fontSize: '1.7em'
//   },
//   textarea : {
//     fontSize: '1.1em',
//     padding:'5px',
//     margin:'20px 20px 0px 0px',
//     minWidth:'60%'
//   }
// })

// class CreateTestForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       title :"",
//       subjects : [],
//       maxmarks : 30,
//       queTypes : [],
//       startTime: "",
//       endTime : "",
//       duration : "00:30",
//       regStartTime : "",
//       regEndTime : "",
//       resultTime : ""
//     }
//   }

//   titleInputHandler = (event) => {
//     this.setState({
//       ...this.state,
//       title : event.target.value
//     });
//   }

//   subjectCheckboxInputHandler = (event) => {
//     var list = this.state.subjects;
//     if(event.target.checked) {
//       list.push(event.target.name);
//       this.setState({
//         ...this.state,
//         subjects : list
//       })
//     } else {
//       this.setState({
//         ...this.state,
//         subjects : list.filter((v)=>(v!==event.target.name))
//       })
//     }
    
//   } 

//   queTypestCheckboxInputHandler = (event) => {
//     var list = this.state.queTypes;
//     var n = parseInt(event.target.name)
//     if(event.target.checked) {
//       list.push(n);
//       this.setState({
//         ...this.state,
//         queTypes : list
//       })
//     } else {
//       this.setState({
//         ...this.state,
//         queTypes : list.filter((v)=>(v!==n))
//       })
//     }
    
//   }

//   marksInputHandler = (event) => {
//     this.setState({
//       ...this.state,
//       maxmarks : parseInt(event.target.value)
//     })
//   }

//   startTimeInputHandler = (event) => {
//     this.setState({
//       ...this.state,
//       startTime : event.target.value
//     })
//   }

//   endTimeInputHandler = (event) => {
//     this.setState({
//       ...this.state,
//       endTime : event.target.value
//     })
//   }

//   TestDurationInputHandler = (event) => {
//     this.setState({
//       ...this.state,
//       duration : event.target.value
//     })
//   }

//   regStartTimeInputHandler = (event) => {
//     this.setState({
//       ...this.state,
//       regStartTime : event.target.value
//     })
//   }

//   regEndTimeInputHandler = (event) => {
//     this.setState({
//       ...this.state,
//       regEndTime : event.target.value
//     })
//   }

//   resultTimeInputHandler = (event) => {
//     this.setState({
//       ...this.state,
//       resultTime : event.target.value
//     })
//   }

//   sendAlert(type,title,message) {
//     this.props.setAlert({
//       isAlert:true,
//       type:type,
//       title:title,
//       message:message
//     })
//   }

//   timeStringtoMs(str) {
//     var hours = parseInt(str.substring(0,2));
//     var mins = parseInt(str.substring(3));
//     return ((hours * 60 + mins) * 60 * 1000)
//   }

//   handleSubmit(event) {
//     event.preventDefault();
//     var dur = this.timeStringtoMs(this.state.duration);
//     if(this.state.subjects.length<1) {
//       this.sendAlert('error','Invalid input','select subject');
//     } else if(this.state.queTypes.length < 1) {
//       this.sendAlert('error','Invalid input','select question type');
//     } else if(Date.parse(this.state.regStartTime) >= Date.parse(this.state.regEndTime)) {
//       this.sendAlert('error','Invalid input','Invalid Registration start and end time');
//     } else if(Date.parse(this.state.startTime) >= Date.parse(this.state.endTime)) {
//       this.sendAlert('error','Invalid input','Invalid Test start and end time');
//     } else if(Date.parse(this.state.regEndTime) >= Date.parse(this.state.startTime)) {
//       this.sendAlert('error','Invalid input','Invalid Test start time');
//     } else if(Date.parse(this.state.endTime) >= Date.parse(this.state.resultTime)) {
//       this.sendAlert('error','Invalid input','Invalid Test result time');
//     } else if((Date.parse(this.state.endTime) - Date.parse(this.state.startTime) - dur) < 0) {
//       this.sendAlert('error','Invalid input','Invalid Test duration time');
//     } else {
//       this.props.createTestAction({...this.state,duration:dur/1000});
//     }
//   }

//   render() {
//     if(this.props.subjectDetails.retrived === false) {
//       this.props.getSubjectDetails();
//       return (<div></div>);
//     }
//     return(
//       <form className={this.props.classes.formClass} onSubmit={(event)=>(this.handleSubmit(event))}>
//         <div className={this.props.classes.formTitle} color="primary">Create Test</div>
//         <TextField
//           variant='outlined'
//           color="primary"
//           className={this.props.classes.questionInput}
//           label="Title"
//           placeholder='enter title'
//           type='text'
//           error_text=''
//           value={this.state.title}
//           onChange={(event)=>(this.titleInputHandler(event))}
//           required
//           fullWidth
//         />
//         <FormLabel className={this.props.classes.optionInput} >Subjects</FormLabel>
//         <FormGroup className={this.props.classes.inputfield}>
//           {this.props.subjectDetails.list.map((sub)=>(
//             <FormControlLabel key={sub.id}
//               control={<Checkbox name={sub.id} onChange={(event)=>(this.subjectCheckboxInputHandler(event))} />}
//               label={sub.subject}
//             />
//           ))}
          
//         </FormGroup>
//         <br/>
//         <FormLabel className={this.props.classes.optionInput} >Question Types</FormLabel>
//         <FormGroup className={this.props.classes.inputfield}>
//           <FormControlLabel
//             control={<Checkbox name="1" onChange={(event)=>(this.queTypestCheckboxInputHandler(event))} />}
//             label="1 Marks"
//           />
//           <FormControlLabel
//             control={<Checkbox name="2" onChange={(event)=>(this.queTypestCheckboxInputHandler(event))} />}
//             label="2 Marks"
//           />
//           <FormControlLabel
//             control={<Checkbox name="3" onChange={(event)=>(this.queTypestCheckboxInputHandler(event))} />}
//             label="3 Marks"
//           />
//           <FormControlLabel
//             control={<Checkbox name="4" onChange={(event)=>(this.queTypestCheckboxInputHandler(event))} />}
//             label="4 Marks"
//           />
          
          
          
//         </FormGroup>
//         <br/>
//         <TextField
//           variant='outlined'
//           color="primary"
//           className={this.props.classes.optionInput}
//           label="Max Marks"
//           placeholder='enter marks'
//           type='number'
//           error_text=''
//           value={this.state.maxmarks}
//           onChange={(event)=>(this.marksInputHandler(event))}
//           required
//           InputProps={{
//             inputProps: { 
//               max: 100, min: 5
//             }
//           }}
//         />
//         <TextField
//           variant='outlined'
//           color="primary"
//           className={this.props.classes.optionInput}
//           label="Registration Start Time"
//           type='datetime-local'
//           error_text=''
//           value={this.state.regStartTime}
//           onChange={(event)=>(this.regStartTimeInputHandler(event))}
//           required
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//         <TextField
//           variant='outlined'
//           color="primary"
//           className={this.props.classes.optionInput}
//           label="Registration End Time"
//           type='datetime-local'
//           error_text=''
//           value={this.state.regEndTime}
//           onChange={(event)=>(this.regEndTimeInputHandler(event))}
//           required
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//         <br/>
//         <TextField
//           variant='outlined'
//           color="primary"
//           className={this.props.classes.optionInput}
//           label="Start Time"
//           type='datetime-local'
//           error_text=''
//           value={this.state.startTime}
//           onChange={(event)=>(this.startTimeInputHandler(event))}
//           required
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
        
//         <TextField
//           variant='outlined'
//           color="primary"
//           className={this.props.classes.optionInput}
//           label="End Time"
//           type='datetime-local'
//           error_text=''
//           value={this.state.endTime}
//           onChange={(event)=>(this.endTimeInputHandler(event))}
//           required
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//         <TextField
//           variant='outlined'
//           color="primary"
//           className={this.props.classes.optionInput}
//           label="Test Duration"
//           type='time'
//           error_text=''
//           value={this.state.duration}
//           onChange={(event)=>(this.TestDurationInputHandler(event))}
//           required
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//         <br/>
//         <TextField
//           variant='outlined'
//           color="primary"
//           className={this.props.classes.optionInput}
//           label="Result Time"
//           type='datetime-local'
//           error_text=''
//           value={this.state.resultTime}
//           onChange={(event)=>(this.resultTimeInputHandler(event))}
//           required
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//         <br/>
//         <Button 
//           variant='contained'
//           color="primary"
//           type='submit'
//           className={this.props.classes.btn}
//         >
//           Create test
//         </Button>
//       </form>
//     )
//   }
// }

// const mapStatetoProps = state => ({
//   subjectDetails : state.subjectDetails
// })

// export default withStyles(useStyles)(connect(mapStatetoProps,{
//   getSubjectDetails,
//   setAlert,
//   createTestAction
// })(CreateTestForm));


import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {
  withStyles,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Checkbox,
} from "@material-ui/core";
import { connect } from "react-redux";

import { getSubjectDetails } from "../../../redux/actions/subjectAction";
import { setAlert } from "../../../redux/actions/alertAction";
import { createTestAction } from "../../../redux/actions/teacherTestAction";

// UPDATED: Improved styling for dark background
const useStyles = () => ({
  formClass: {
    margin: "20px auto",
    display: "block",
    width: "calc(100% - 40px)",
    maxWidth: "1100px",
    boxSizing: "border-box",
    textAlign: "center",
    border: "1px solid #90a4ae",
    borderRadius: "12px",
    padding: "30px 20px",
    color: "white",
    backgroundColor: "rgba(20, 30, 48, 0.25)",
  },

  formTitle: {
    fontSize: "2em",
    color: "white",
    marginBottom: "25px",
    fontWeight: 500,
  },

  // UPDATED: Title input text, label and border
  questionInput: {
    marginTop: "15px",
    marginBottom: "20px",

    "& .MuiInputBase-input": {
      color: "white",
    },
    "& .MuiInputLabel-root": {
      color: "#cccccc",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#90caf9",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#90a4ae",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
  },

  // UPDATED: Other input fields
  optionInput: {
    display: "inline-flex",
    width: "290px",
    maxWidth: "100%",
    margin: "16px",
    verticalAlign: "top",

    "& .MuiInputBase-input": {
      color: "white",
    },
    "& .MuiInputLabel-root": {
      color: "#cccccc",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#90caf9",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#90a4ae",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },

    // UPDATED: Light calendar and clock icons
    "& input::-webkit-calendar-picker-indicator": {
      filter: "invert(1)",
      cursor: "pointer",
    },
  },

  // UPDATED: Subjects and Question Types headings
  sectionLabel: {
    display: "block",
    color: "white",
    fontSize: "1.2rem",
    marginTop: "18px",
    marginBottom: "10px",
    "&.Mui-focused": {
      color: "white",
    },
  },

  // UPDATED: Checkbox alignment
  inputfield: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px 0 25px",
  },

  // UPDATED: Checkbox labels and checkbox colors
  checkboxLabel: {
    color: "white",
    margin: "5px 12px",

    "& .MuiFormControlLabel-label": {
      color: "white",
      fontSize: "1rem",
    },
  },

  checkboxRoot: {
    color: "#cbd5e1",
    "&$checkboxChecked": {
      color: "#90caf9",
    },
  },

  checkboxChecked: {},

  btn: {
    margin: "25px 20px 10px",
    padding: "10px 30px",
  },
});

class CreateTestForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      subjects: [],
      maxmarks: 30,
      queTypes: [],
      startTime: "",
      endTime: "",
      duration: "00:30",
      regStartTime: "",
      regEndTime: "",
      resultTime: "",
    };
  }

  titleInputHandler = (event) => {
    this.setState({
      ...this.state,
      title: event.target.value,
    });
  };

  subjectCheckboxInputHandler = (event) => {
    var list = this.state.subjects;

    if (event.target.checked) {
      list.push(event.target.name);
      this.setState({
        ...this.state,
        subjects: list,
      });
    } else {
      this.setState({
        ...this.state,
        subjects: list.filter((v) => v !== event.target.name),
      });
    }
  };

  queTypestCheckboxInputHandler = (event) => {
    var list = this.state.queTypes;
    var n = parseInt(event.target.name);

    if (event.target.checked) {
      list.push(n);
      this.setState({
        ...this.state,
        queTypes: list,
      });
    } else {
      this.setState({
        ...this.state,
        queTypes: list.filter((v) => v !== n),
      });
    }
  };

  marksInputHandler = (event) => {
    this.setState({
      ...this.state,
      maxmarks: parseInt(event.target.value),
    });
  };

  startTimeInputHandler = (event) => {
    this.setState({
      ...this.state,
      startTime: event.target.value,
    });
  };

  endTimeInputHandler = (event) => {
    this.setState({
      ...this.state,
      endTime: event.target.value,
    });
  };

  TestDurationInputHandler = (event) => {
    this.setState({
      ...this.state,
      duration: event.target.value,
    });
  };

  regStartTimeInputHandler = (event) => {
    this.setState({
      ...this.state,
      regStartTime: event.target.value,
    });
  };

  regEndTimeInputHandler = (event) => {
    this.setState({
      ...this.state,
      regEndTime: event.target.value,
    });
  };

  resultTimeInputHandler = (event) => {
    this.setState({
      ...this.state,
      resultTime: event.target.value,
    });
  };

  sendAlert(type, title, message) {
    this.props.setAlert({
      isAlert: true,
      type: type,
      title: title,
      message: message,
    });
  }

  timeStringtoMs(str) {
    var hours = parseInt(str.substring(0, 2));
    var mins = parseInt(str.substring(3));
    return (hours * 60 + mins) * 60 * 1000;
  }

  handleSubmit(event) {
    event.preventDefault();

    var dur = this.timeStringtoMs(this.state.duration);

    if (this.state.subjects.length < 1) {
      this.sendAlert("error", "Invalid input", "select subject");
    } else if (this.state.queTypes.length < 1) {
      this.sendAlert("error", "Invalid input", "select question type");
    } else if (
      Date.parse(this.state.regStartTime) >=
      Date.parse(this.state.regEndTime)
    ) {
      this.sendAlert(
        "error",
        "Invalid input",
        "Invalid Registration start and end time"
      );
    } else if (
      Date.parse(this.state.startTime) >= Date.parse(this.state.endTime)
    ) {
      this.sendAlert("error", "Invalid input", "Invalid Test start and end time");
    } else if (
      Date.parse(this.state.regEndTime) >= Date.parse(this.state.startTime)
    ) {
      this.sendAlert("error", "Invalid input", "Invalid Test start time");
    } else if (
      Date.parse(this.state.endTime) >= Date.parse(this.state.resultTime)
    ) {
      this.sendAlert("error", "Invalid input", "Invalid Test result time");
    } else if (
      Date.parse(this.state.endTime) -
        Date.parse(this.state.startTime) -
        dur <
      0
    ) {
      this.sendAlert("error", "Invalid input", "Invalid Test duration time");
    } else {
      this.props.createTestAction({
        ...this.state,
        duration: dur / 1000,
      });
    }
  }

  render() {
    if (this.props.subjectDetails.retrived === false) {
      this.props.getSubjectDetails();
      return <div></div>;
    }

    const classes = this.props.classes;

    return (
      <form
        className={classes.formClass}
        onSubmit={(event) => this.handleSubmit(event)}
      >
        <div className={classes.formTitle}>
          Create Test
        </div>

        <TextField
          variant="outlined"
          color="primary"
          className={classes.questionInput}
          label="Title"
          placeholder="Enter title"
          type="text"
          value={this.state.title}
          onChange={this.titleInputHandler}
          required
          fullWidth
        />

        {/* UPDATED: Subjects heading and checkbox styling */}
        <FormLabel className={classes.sectionLabel}>
          Subjects
        </FormLabel>

        <FormGroup className={classes.inputfield}>
          {this.props.subjectDetails.list.map((sub) => (
            <FormControlLabel
              key={sub.id}
              className={classes.checkboxLabel}
              control={
                <Checkbox
                  name={sub.id}
                  onChange={this.subjectCheckboxInputHandler}
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checkboxChecked,
                  }}
                />
              }
              label={sub.subject}
            />
          ))}
        </FormGroup>

        {/* UPDATED: Question Types heading and checkbox styling */}
        <FormLabel className={classes.sectionLabel}>
          Question Types
        </FormLabel>

        <FormGroup className={classes.inputfield}>
          {[1, 2, 3, 4].map((n) => (
            <FormControlLabel
              key={n}
              className={classes.checkboxLabel}
              control={
                <Checkbox
                  name={String(n)}
                  onChange={this.queTypestCheckboxInputHandler}
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checkboxChecked,
                  }}
                />
              }
              label={`${n} Marks`}
            />
          ))}
        </FormGroup>

        <TextField
          variant="outlined"
          color="primary"
          className={classes.optionInput}
          label="Max Marks"
          placeholder="Enter marks"
          type="number"
          value={this.state.maxmarks}
          onChange={this.marksInputHandler}
          required
          InputProps={{
            inputProps: {
              max: 100,
              min: 5,
            },
          }}
        />

        <TextField
          variant="outlined"
          color="primary"
          className={classes.optionInput}
          label="Registration Start Time"
          type="datetime-local"
          value={this.state.regStartTime}
          onChange={this.regStartTimeInputHandler}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          variant="outlined"
          color="primary"
          className={classes.optionInput}
          label="Registration End Time"
          type="datetime-local"
          value={this.state.regEndTime}
          onChange={this.regEndTimeInputHandler}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          variant="outlined"
          color="primary"
          className={classes.optionInput}
          label="Start Time"
          type="datetime-local"
          value={this.state.startTime}
          onChange={this.startTimeInputHandler}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          variant="outlined"
          color="primary"
          className={classes.optionInput}
          label="End Time"
          type="datetime-local"
          value={this.state.endTime}
          onChange={this.endTimeInputHandler}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          variant="outlined"
          color="primary"
          className={classes.optionInput}
          label="Test Duration"
          type="time"
          value={this.state.duration}
          onChange={this.TestDurationInputHandler}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          variant="outlined"
          color="primary"
          className={classes.optionInput}
          label="Result Time"
          type="datetime-local"
          value={this.state.resultTime}
          onChange={this.resultTimeInputHandler}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <br />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.btn}
        >
          Create Test
        </Button>
      </form>
    );
  }
}

const mapStatetoProps = (state) => ({
  subjectDetails: state.subjectDetails,
});

export default withStyles(useStyles)(
  connect(mapStatetoProps, {
    getSubjectDetails,
    setAlert,
    createTestAction,
  })(CreateTestForm)
);
