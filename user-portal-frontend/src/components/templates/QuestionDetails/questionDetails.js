import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import QuestionSearchBox from "../../atoms/SearchBox/QuestionSearchBox";
import {
  deleteQuestion,
  getAllQuestions,
  searchQuestion,
} from "../../../redux/actions/questionAction";
import QuestionTable from "../../molecues/QuestionsTable/QuestionTable";
import ViewnUpdateQuestion from "../ViewnUpdateQuestion/ViewnUpdateQuestion";
import { Button } from "@material-ui/core";
import { goBacktoSearch } from "../../../redux/actions/questionAction";

const useStyles = (theme)=> ({
    questionDetails : {
      width:'min(100% - 32px, 1000px)',
      margin:'24px auto',
      textAlign : 'center',
    },
    toolbar : {
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      gap:'12px',
      flexWrap:'wrap',
      marginBottom:'16px',
    }
})

class QuestionDetails extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.props.getAllQuestions();
  }

  searchQuestions = (details) => {
    const query = details.query.trim();
    if(query) {
      this.props.searchQuestion({query});
    } else {
      this.props.getAllQuestions();
    }
  }

  deleteQuestion = (id) => {
    if(window.confirm('Delete this question? This action cannot be undone.')) {
      this.props.deleteQuestion(id);
    }
  }

  render(){
    const viewingQuestion = this.props.questionDetails.question._id !== undefined;
    return(
      <div className={this.props.classes.questionDetails}>
        <div className={this.props.classes.toolbar}>
          <QuestionSearchBox searchCallback={this.searchQuestions}/>
          <Button
            variant="contained"
            color="primary"
            onClick={this.props.onAddQuestion}
          >
            Add Question
          </Button>
        </div>
        {viewingQuestion ? (
          <div>
            <ViewnUpdateQuestion className={this.props.classes.questionDetails}/>
            <Button onClick={this.props.goBacktoSearch}>Back to questions</Button>
          </div>
        ) : (
          <QuestionTable onDeleteQuestion={this.deleteQuestion}/>
        )}
      </div>
    );
  }
}

const mapStatetoProps = state => ({
  questionDetails : state.questionDetails
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  searchQuestion,
  goBacktoSearch,
  getAllQuestions,
  deleteQuestion
})(QuestionDetails));