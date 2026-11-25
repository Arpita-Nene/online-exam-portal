import { TableBody, TableCell, TableRow, withStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { getQuestionAnswerActionStudent } from "../../../redux/actions/studentTestAction";
import { TableContainer, Table, Paper }  from "@material-ui/core";

const useStyles = (theme) => ({
  tableBorder:{
    background:'#e7e7e7',
    padding:'15px'
  },
  tableHeader:{
    background:'#3f51b5',
    color:'white'
  },
  testTitle : {
    fontSize : '1.7em',
    textAlign : 'center',
    margin : '20px'
  },
  table : {
    margin : '20px'
  },
  tkey : {
    marginRight : '30px',
    color : '#8de2e6',
    minWidth : '100px',
    display : 'inline-block',
    padding : '5px 10px',
    background : 'rgba(49, 171, 183, 0.14)',
    borderRadius : '20px'
  },
  tbody : {
    margin : '5px',
    color : '#edf4fc',
    background : '#26364d',
    padding : '5px 10px',
    borderRadius : '20px',
    display : 'inline-block',
    maxWidth : 'calc(100% - 150px)',
    overflowWrap : 'anywhere',
    verticalAlign : 'top'
  },
  toption : {
    display : 'inline-block',
    margin : '5px 20px 5px 5px',
    padding : '3px 10px',
    borderRadius : '20px',
    color : '#dce7f3',
    background : '#26364d'
  },
  tcorrect : {
    display : 'inline-block',
    margin : '5px 20px 5px 5px',
    padding : '3px 10px',
    borderRadius : '20px',
    color : '#86efac',
    background : 'rgba(34, 197, 94, 0.18)'
  },
  tfalse : {
    display : 'inline-block',
    margin : '5px 20px 5px 5px',
    padding : '3px 10px',
    borderRadius : '20px',
    color : '#fca5a5',
    background : 'rgba(239, 68, 68, 0.18)'
  },
  tablecell : {
    borderWidth : '1px 2px',
    borderColor : 'rgba(126, 158, 187, 0.18)',
    borderStyle : 'solid'
  }
})

class TestResultViewQuestions extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    if(this.props.result.resultQuestion!==undefined) {
      var resultQuestion = [];
      for(var i in this.props.result.resultQuestion) {
        resultQuestion.push({
          ...this.props.result.resultQuestion[i],
          studentanswer : this.props.result.answers[i]
        });
      }
      return(<div>
        <div className={this.props.classes.testTitle} color="primary">Questions</div>
        <TableContainer component={Paper} className={this.props.classes.table}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
          {resultQuestion.map(r=>(
            <TableRow key={r._id}> 
            <TableCell className={this.props.classes.tablecell}>
              <span className={this.props.classes.tkey}>Question</span>
              :
              <span className={this.props.classes.tbody}>{r.body}</span>
              <br/>
              <span className={this.props.classes.tkey}>Options </span>
              :
              <span style={{'display':'inline-block','margin':'2px'}}>
                <span className={r.answer===r.options[0]?this.props.classes.tcorrect : this.props.classes.toption}>{r.options[0]}</span>
                <span className={r.answer===r.options[1]?this.props.classes.tcorrect : this.props.classes.toption}>{r.options[1]}</span>
                <span className={r.answer===r.options[2]?this.props.classes.tcorrect : this.props.classes.toption}>{r.options[2]}</span>
                <span className={r.answer===r.options[3]?this.props.classes.tcorrect : this.props.classes.toption}>{r.options[3]}</span>
              </span>
              <br/>
              <span className={this.props.classes.tkey}>Marks </span>
              :
              <span className={r.answer===r.studentanswer?this.props.classes.tcorrect : this.props.classes.tfalse}>{r.answer===r.studentanswer?r.marks : 0}</span> 
              <br/>
              <span className={this.props.classes.tkey}>Your Answer </span>
              :
              <span className={r.answer===r.studentanswer?this.props.classes.tcorrect : this.props.classes.tfalse}>{r.studentanswer|| "(no answer selected)"}</span> 
              <br/>
              <span className={this.props.classes.tkey}>Explanation </span>
              :
              <span className={this.props.classes.tbody}>{r.explanation}</span> 
              <br/>
            </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
        </TableContainer>
        
      </div>)
    } else {
      console.log(this.props.result.questions);
      this.props.getQuestionAnswerActionStudent({queids:this.props.result.questions});
      return(<div>processing</div>)
    }
  }
}

const mapStatetoProps = state => ({
  result : state.testDetails.test
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  getQuestionAnswerActionStudent
})(TestResultViewQuestions));

