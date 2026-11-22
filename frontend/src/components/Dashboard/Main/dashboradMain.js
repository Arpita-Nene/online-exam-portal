// import { withStyles} from "@material-ui/core/styles";
// import React from "react";
// import { connect } from "react-redux";
// import { Link, Navigate } from "react-router-dom";
// import { logoutUser, getAdminDetails } from "../../../redux/actions/loginAction";
// import { getDashboardCount } from "../../../redux/actions/dashboardDetails";
// import Auth from "../../../services/Auth";
// import { HomepageHeader } from "../../basic/header/header";
// import logoImg from '../../basic/Homepage/main.jpg'
// import { MainCard } from "../Card/card";
// import TeacherImg from '../teacher.png';
// import StudentImg from '../student.jfif';
// import SubjectImg from '../subject.jfif';
// import TeacherTable from "../teacherTable/teacherTable";
// import SubjectTable from "../subjectTable/subjectTable";
// import StudentTable from "../studentTable/studentTable";

// const useStyles = (theme)=>({
//   logout_btn : {
//     marginLeft : '80%'
//   },
//   headerMargin : {
//     marginTop : 80
//   },
//   inlineblock : {
//     display : 'inline-block'
//   },
//   linkbtn : {
//     color:'black'
//   }
// })

// class DashboardMain extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {}
//     this.expand = "none"
//   }

//   logout(obj) {
//     obj.props.logoutUser();
//     obj.forceUpdate();
//   }

//   handleTableExapand(type) {
//     console.log("handle table")
//     if(type === this.expand) {
//       this.expand = "none"
//     } else {
//       this.expand = type
//     }
//     this.forceUpdate();
//   }

//   render(){
//     console.log(this.props.user);
//     if(!Auth.retriveToken() || Auth.retriveToken()==='undefined'){
//       return (<Navigate to='/'/>);
//     } else if(!this.props.user.isLoggedIn) {
//       this.props.getAdminDetails();
//       return (<div></div>);
//     } else {
//       if(!this.props.dashboardDetails.retrived){
//         this.props.getDashboardCount();
//       }
//       let x;
//       if(this.expand === "Teacher") {
//         x = <TeacherTable/>;
//       } else if (this.expand === "Student") {
//         x = <StudentTable/>;
//       } else if (this.expand === "Subject") {
//         x = <SubjectTable/>;
//       }
//         return (
//           <div>
//             <HomepageHeader title='Exam Portal' img={logoImg}/>
//             <div className={this.props.classes.headerMargin}></div>
//             <button onClick={()=>(this.logout(this))} className={this.props.classes.logout_btn} >Logout</button>
//             <br/>
//             <MainCard title='Teacher' value={this.props.dashboardDetails.teacherActive} total={this.props.dashboardDetails.teacherActive + this.props.dashboardDetails.teacherBlocked}  image={TeacherImg} />
//             <div className={this.props.classes.inlineblock}>
//               <button ><Link to="/addTeacher" className={this.props.classes.linkbtn}>Add Teacher</Link></button>
//               <br/>
//               <button onClick={()=>(this.handleTableExapand("Teacher"))}>Show</button>
//             </div>
//             <MainCard title='Student' value={this.props.dashboardDetails.studentActive} total={this.props.dashboardDetails.studentActive + this.props.dashboardDetails.studentBlocked} image={StudentImg} />
//             <button onClick={()=>(this.handleTableExapand("Student"))}>Show</button>
//             <MainCard title='Subject' value={this.props.dashboardDetails.subjectActive} total={this.props.dashboardDetails.subjectActive + this.props.dashboardDetails.subjectBlocked} image={SubjectImg} />
//             <div className={this.props.classes.inlineblock}>
//               <button ><Link to="/addSubject" className={this.props.classes.linkbtn}>Add Subject</Link></button>
//               <br/>
//               <button onClick={()=>(this.handleTableExapand("Subject"))}>Show</button>
//             </div>
//             <br/>

//             {x}
//           </div>
//         );

//     }
    
//   }
// }

// const mapStateToProps = state => ({
//   user:state.user,
//   dashboardDetails:state.dashboardDetails
// });

// export default withStyles(useStyles)(connect(mapStateToProps,{
//   logoutUser,
//   getAdminDetails,
//   getDashboardCount,
// })(DashboardMain));

import React from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";

import {
  logoutUser,
  getAdminDetails
} from "../../../redux/actions/loginAction";

import { getDashboardCount } from "../../../redux/actions/dashboardDetails";
import Auth from "../../../services/Auth";

import { HomepageHeader } from "../../basic/header/header";
import logoImg from "../../basic/Homepage/main.jpg";

import { MainCard } from "../Card/card";

import TeacherImg from "../teacher.png";
import StudentImg from "../student.jfif";
import SubjectImg from "../subject.jfif";

import TeacherTable from "../teacherTable/teacherTable";
import SubjectTable from "../subjectTable/subjectTable";
import StudentTable from "../studentTable/studentTable";

import "./dashboardMain.css";

class DashboardMain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expandedTable: null
    };
  }

  handleTableExpand = (type) => {
    this.setState({
      expandedTable:
        this.state.expandedTable === type ? null : type
    });
  };

  logout = () => {
    this.props.logoutUser();
  };

  render() {
    if (!Auth.retriveToken() ||
        Auth.retriveToken() === "undefined") {
      return <Navigate to="/" />;
    }

    if (!this.props.user.isLoggedIn) {
      this.props.getAdminDetails();
      return <div>Loading...</div>;
    }

    if (!this.props.dashboardDetails.retrived) {
      this.props.getDashboardCount();
    }

    const { expandedTable } = this.state;
    const { dashboardDetails } = this.props;

    let selectedTable = null;

    if (expandedTable === "Teacher") {
      selectedTable = <TeacherTable />;
    } else if (expandedTable === "Student") {
      selectedTable = <StudentTable />;
    } else if (expandedTable === "Subject") {
      selectedTable = <SubjectTable />;
    }

    return (
      <div className="dashboard-page">

        <HomepageHeader
          title="Exam Portal"
          img={logoImg}
        />

        <main className="dashboard-container">

          <div className="dashboard-heading">
            <div>
              <h1>Dashboard Overview</h1>
              <p>Manage your examination portal from one place.</p>
            </div>

            <button
              className="logout-btn"
              onClick={this.logout}
            >
              Logout
            </button>
          </div>

          <div className="dashboard-cards">

            <MainCard
              title="Teachers"
              value={dashboardDetails.teacherActive}
              total={
                dashboardDetails.teacherActive +
                dashboardDetails.teacherBlocked
              }
              image={TeacherImg}
            />

            <MainCard
              title="Students"
              value={dashboardDetails.studentActive}
              total={
                dashboardDetails.studentActive +
                dashboardDetails.studentBlocked
              }
              image={StudentImg}
            />

            <MainCard
              title="Subjects"
              value={dashboardDetails.subjectActive}
              total={
                dashboardDetails.subjectActive +
                dashboardDetails.subjectBlocked
              }
              image={SubjectImg}
            />

          </div>

          <div className="management-section">

            <div className="section-heading">
              <h2>Management</h2>
              <p>Manage your teachers, students and subjects.</p>
            </div>

            <div className="management-grid">

              <div className="management-card">
                <div className="management-icon">👨‍🏫</div>
                <h3>Teacher Management</h3>
                <p>Add new teachers and manage existing accounts.</p>

                <div className="management-actions">
                  <Link to="/addTeacher" className="primary-btn">
                    + Add Teacher
                  </Link>

                  <button
                    className="secondary-btn"
                    onClick={() => this.handleTableExpand("Teacher")}
                  >
                    View Teachers
                  </button>
                </div>
              </div>

              <div className="management-card">
                <div className="management-icon">🎓</div>
                <h3>Student Management</h3>
                <p>View registered students and manage their accounts.</p>

                <div className="management-actions">
                  <button
                    className="secondary-btn"
                    onClick={() => this.handleTableExpand("Student")}
                  >
                    View Students
                  </button>
                </div>
              </div>

              <div className="management-card">
                <div className="management-icon">📚</div>
                <h3>Subject Management</h3>
                <p>Add subjects and manage available subjects.</p>

                <div className="management-actions">
                  <Link to="/addSubject" className="primary-btn">
                    + Add Subject
                  </Link>

                  <button
                    className="secondary-btn"
                    onClick={() => this.handleTableExpand("Subject")}
                  >
                    View Subjects
                  </button>
                </div>
              </div>

            </div>
          </div>

          {selectedTable && (
            <div className="dashboard-table-section">
              <div className="section-heading">
                <h2>{expandedTable} Details</h2>
                <button
                  className="secondary-btn"
                  onClick={() => this.handleTableExpand(expandedTable)}
                >
                  Close
                </button>
              </div>

              {selectedTable}
            </div>
          )}

        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  dashboardDetails: state.dashboardDetails
});

export default connect(mapStateToProps, {
  logoutUser,
  getAdminDetails,
  getDashboardCount
})(DashboardMain);


