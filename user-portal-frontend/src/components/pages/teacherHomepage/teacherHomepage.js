import React from "react";
import { connect } from "react-redux";
import Auth from "../../../helper/Auth";
import { Navigate } from "react-router-dom";
import { getUserDetails } from "../../../redux/actions/loginAction";
import AddQuestionForm from "../../templates/AddQuestionForm/AddQuestionForm";
import AlertBox from "../../atoms/Alertbox/AlertBox";
import DashboardHome from "../../templates/DashboardLayout/DashboardHome";
import DashboardLayout from "../../templates/DashboardLayout/DashboardLayout";
import QuestionDetails from "../../templates/QuestionDetails/questionDetails";
import CreateTestForm from "../../templates/CreateTestForm/CreateTestForm";
import TestDetails from "../../templates/TestDetails/TestDetails";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";

class TeacherHomepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      menuList: [
        {
          title: "Overview",
          icon: HomeRoundedIcon,
          content: (
            <DashboardHome
              role="Teacher"
              description="Manage your question bank, prepare tests, and review the tests you have created."
              actions={[
                {
                  title: "Add a question",
                  description: "Create a new question for your question bank.",
                  icon: AddCircleOutlineRoundedIcon,
                  onClick: () => this.onMenuItemClick(1),
                },
                {
                  title: "Question bank",
                  description: "Browse and manage your existing questions.",
                  icon: HelpOutlineRoundedIcon,
                  onClick: () => this.onMenuItemClick(2),
                },
                {
                  title: "Create a test",
                  description: "Build a test using your available questions.",
                  icon: CreateRoundedIcon,
                  onClick: () => this.onMenuItemClick(3),
                },
              ]}
            />
          ),
        },
        {
          title: "Add Question",
          icon: AddCircleOutlineRoundedIcon,
          content: <AddQuestionForm />,
        },
        {
          title: "Questions",
          icon: HelpOutlineRoundedIcon,
          content: <QuestionDetails onAddQuestion={() => this.onMenuItemClick(1)} />,
        },
        {
          title: "Create Test",
          icon: CreateRoundedIcon,
          content: <CreateTestForm />,
        },
        {
          title: "View Tests",
          icon: AssignmentOutlinedIcon,
          content: <TestDetails />,
        },
      ],
    };
  }

  onMenuItemClick = (activeIndex) => {
    this.setState({ activeIndex });
  };

  render() {
    if (!Auth.retriveToken() || Auth.retriveToken() === "undefined") {
      return <Navigate to="/" />;
    } else if (!this.props.user.isLoggedIn) {
      this.props.getUserDetails();
      return <div />;
    } else if (this.props.user.userDetails.type !== "TEACHER") {
      return <Navigate to="/" />;
    }

    const activeItem = this.state.menuList[this.state.activeIndex];
    return (
      <DashboardLayout
        title="Teacher Workspace"
        username={this.props.user.userDetails.username}
        items={this.state.menuList}
        activeIndex={this.state.activeIndex}
        onNavigate={this.onMenuItemClick}
      >
        <AlertBox />
        {activeItem.content}
      </DashboardLayout>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { getUserDetails })(TeacherHomepage);
