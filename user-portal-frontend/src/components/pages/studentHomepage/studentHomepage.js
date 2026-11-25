import React from "react";
import { connect } from "react-redux";
import Auth from "../../../helper/Auth";
import { Navigate } from "react-router-dom";
import { getUserDetails } from "../../../redux/actions/loginAction";
import DashboardHome from "../../templates/DashboardLayout/DashboardHome";
import DashboardLayout from "../../templates/DashboardLayout/DashboardLayout";
import AlertBox from "../../atoms/Alertbox/AlertBox";
import TestDetailsStudent from "../../templates/TestDetails/TestDetailsStudent";
import UpcomingStudentTestsDetails from "../../templates/TestDetails/UpcomingStudentTestsDetails";
import CompletedTestsDetailsStudent from "../../templates/TestDetails/CompletedTestsDetailsStudent";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import ListAltRoundedIcon from "@material-ui/icons/ListAltRounded";
import EventAvailableRoundedIcon from "@material-ui/icons/EventAvailableRounded";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";

class StudentHomepage extends React.Component {
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
              role="Student"
              description="Find available exams, keep track of upcoming tests, and review your completed work."
              actions={[
                {
                  title: "Browse tests",
                  description: "See all exams available in the portal.",
                  icon: ListAltRoundedIcon,
                  onClick: () => this.onMenuItemClick(1),
                },
                {
                  title: "Upcoming tests",
                  description: "Check registration and exam schedules.",
                  icon: EventAvailableRoundedIcon,
                  onClick: () => this.onMenuItemClick(2),
                },
                {
                  title: "Completed tests",
                  description: "Review your completed exams and results.",
                  icon: CheckCircleOutlineRoundedIcon,
                  onClick: () => this.onMenuItemClick(3),
                },
              ]}
            />
          ),
        },
        {
          title: "All Tests",
          icon: ListAltRoundedIcon,
          content: <TestDetailsStudent />,
        },
        {
          title: "Upcoming Tests",
          icon: EventAvailableRoundedIcon,
          content: <UpcomingStudentTestsDetails />,
        },
        {
          title: "Completed Tests",
          icon: CheckCircleOutlineRoundedIcon,
          content: <CompletedTestsDetailsStudent />,
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
    } else if (this.props.user.userDetails.type !== "STUDENT") {
      return <Navigate to="/" />;
    }

    const activeItem = this.state.menuList[this.state.activeIndex];
    return (
      <DashboardLayout
        title="Student Workspace"
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

export default connect(mapStateToProps, { getUserDetails })(StudentHomepage);
