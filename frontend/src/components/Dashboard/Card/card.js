// import { makeStyles } from "@material-ui/core"

// const useStyles = makeStyles({
//   card_main:{
//     background:'white',
//     display:'inline-block',
//     padding:'20px 0px 10px 10px',
//     margin:30,
//     borderRadius:10
//   },
//   name:{
//     marginBottom:20,
//     marginLeft:10,
//     fontSize:15,
//     fontWeight:500
//   },
//   d:{
//     display:'flex',
//     color:'darkblue'
//   },
//   d1:{
//     paddingTop:10,
//     fontSize:40,
//     fontWeight:700
//   },
//   d2:{
//     paddingTop:30,
//     fontSize:20,
//     fontWeight:600
//   },
//   img:{
//     marginLeft:30,
//     width:120,
//     height:100
//   }
// })

// export const MainCard = (props)=>{
//   const classes = useStyles();
//   return(
//     <div className={classes.card_main}>
//       <div className={classes.name}>
//         {props.title}
//       </div>
//       <div className={classes.d}>
//         <span className={classes.d1}>{props.value}</span>
//         <span className={classes.d2}>/{props.total}</span>
//         <img src={props.image} className={classes.img} alt=''/>
//       </div>
//     </div>
//   )
// }


import "./card.css";

export const MainCard = (props) => {
  return (
    <div className="dashboard-stat-card">

      <div className="stat-card-content">
        <h3>{props.title}</h3>

        <div className="stat-card-bottom">
          <div className="stat-number">
            <span>{props.value}</span>
            <small>/{props.total}</small>
          </div>

          <img
            src={props.image}
            alt={props.title}
          />
        </div>

        <p>Active {props.title.toLowerCase()}</p>
      </div>

    </div>
  );
};
