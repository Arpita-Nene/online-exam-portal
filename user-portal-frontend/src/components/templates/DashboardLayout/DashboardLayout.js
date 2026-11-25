import React from "react";
import {
  AppBar,
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SchoolOutlinedIcon from "@material-ui/icons/SchoolOutlined";
import { withStyles } from "@material-ui/core/styles";
import LogoutButton from "../../atoms/LogoutButton/LogoutButton";
import "./dashboard.css";

const drawerWidth = 248;
const appBarHeight = 72;

const useStyles = (theme) => ({
  root: {
    minHeight: "100vh",
    background: "#0b1220",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: appBarHeight,
    background: "rgba(13, 23, 39, 0.96)",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
    backdropFilter: "blur(14px)",
  },
  toolbar: {
    minHeight: `${appBarHeight}px !important`,
    padding: "0 28px",
    [theme.breakpoints.down("sm")]: {
      padding: "0 16px",
    },
  },
  menuButton: {
    display: "none",
    marginRight: theme.spacing(1),
    color: "#d7e2f0",
    [theme.breakpoints.down("sm")]: {
      display: "inline-flex",
    },
  },
  brandIcon: {
    marginRight: theme.spacing(1.5),
    color: "#53d6df",
  },
  title: {
    flexGrow: 1,
    color: "#edf4fc",
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
  },
  userBlock: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.25),
    color: "#c5d0df",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  avatar: {
    width: 36,
    height: 36,
    background: "#173744",
    color: "#75e0e6",
    fontSize: "0.9rem",
    fontWeight: 700,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [theme.breakpoints.down("sm")]: {
      width: 0,
    },
  },
  drawerPaper: {
    boxSizing: "border-box",
    width: drawerWidth,
    top: appBarHeight,
    height: `calc(100% - ${appBarHeight}px)`,
    padding: theme.spacing(2, 1.5),
    background: "#101a2b",
    color: "#c5d0df",
    borderRight: "1px solid rgba(148, 163, 184, 0.12)",
    [theme.breakpoints.down("sm")]: {
      width: 280,
    },
  },
  navLabel: {
    padding: theme.spacing(1, 1.5, 1.5),
    color: "#71839b",
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  navItem: {
    minHeight: 46,
    margin: theme.spacing(0.35, 0),
    padding: theme.spacing(0, 1.5),
    borderRadius: 10,
    color: "#aebcd0",
    "&:hover": {
      background: "rgba(148, 163, 184, 0.08)",
    },
    "&.Mui-selected": {
      color: "#81e1e6",
      background: "rgba(49, 171, 183, 0.16)",
    },
    "&.Mui-selected:hover": {
      background: "rgba(49, 171, 183, 0.22)",
    },
  },
  navIcon: {
    minWidth: 40,
    color: "inherit",
  },
  divider: {
    margin: theme.spacing(2, 0),
    background: "rgba(148, 163, 184, 0.14)",
  },
  logout: {
    padding: theme.spacing(1, 1.5),
  },
  main: {
    minHeight: "100vh",
    marginLeft: drawerWidth,
    paddingTop: appBarHeight,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
    },
  },
  content: {
    width: "100%",
    maxWidth: 1480,
    margin: "0 auto",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(1.5),
    },
  },
});

function DashboardLayout({
  classes,
  title,
  username,
  items,
  activeIndex,
  onNavigate,
  children,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const initials = username ? username.trim().charAt(0).toUpperCase() : "?";

  const drawer = (
    <div>
      <Typography className={classes.navLabel}>Workspace</Typography>
      <List disablePadding>
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <ListItem
              button
              key={item.title}
              selected={activeIndex === index}
              className={classes.navItem}
              onClick={() => {
                onNavigate(index);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon className={classes.navIcon}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          );
        })}
      </List>
      <Divider className={classes.divider} />
      <div className={classes.logout}>
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            aria-label="Open navigation"
            className={classes.menuButton}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <SchoolOutlinedIcon className={classes.brandIcon} />
          <Typography className={classes.title}>{title}</Typography>
          <div className={classes.userBlock}>
            <Typography variant="body2">{username}</Typography>
            <Avatar className={classes.avatar}>{initials}</Avatar>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant={isMobile ? "temporary" : "permanent"}
        open={!isMobile || mobileOpen}
        onClose={() => setMobileOpen(false)}
        classes={{ paper: classes.drawerPaper }}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>

      <main className={classes.main}>
        <div className={`dashboard-content ${classes.content}`}>{children}</div>
      </main>
    </div>
  );
}

export default withStyles(useStyles)(DashboardLayout);
