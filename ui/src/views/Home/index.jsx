import { hot } from 'react-hot-loader';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from 'mdi-react/AccountCircleIcon';
import Button from '../../components/Button';
import Landing from '../../components/Landing';
import SignInDialog from '../../components/SignInDialog';
import Dashboard from '../../components/Dashboard';

@hot(module)
@withStyles(theme => ({
  root: {
    padding: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(5),
    },
  },
  headline: {
    fontFamily: 'Roboto500',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
    },
  },
  actions: {
    marginTop: theme.spacing(3),
  },
  divider: {
    margin: `${theme.spacing(10)}px 0 ${theme.spacing(3)}px`,
    [theme.breakpoints.down('sm')]: {
      margin: `${theme.spacing(5)}px 0 ${theme.spacing(2)}px`,
    },
  },
  icon: {
    fill: theme.palette.common.white,
    marginRight: theme.spacing(1),
  },
}))
export default class Home extends Component {
  state = {
    signInDialogOpen: false,
  };

  handleCloseSignInDialog = () => {
    this.setState({ signInDialogOpen: false });
  };

  handleOpenSignInDialog = () => {
    this.setState({ signInDialogOpen: true });
  };

  render() {
    const { classes } = this.props;
    const { signInDialogOpen } = this.state;

    return (
      <Dashboard>
        <Landing className={classes.root}>
          <Hidden xsDown implementation="css">
            <Typography variant="h1" className={classes.headline}>
              {process.env.APPLICATION_NAME}
            </Typography>
          </Hidden>
          <Hidden smUp implementation="css">
            <Typography variant="h2" className={classes.headline}>
              {process.env.APPLICATION_NAME}
            </Typography>
          </Hidden>
          <Typography variant="h5">
            {
              "A task execution framework that supports Mozilla's continuous integration and release processes."
            }
          </Typography>
          <Divider className={classes.divider} />
          <div className={classes.actions}>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.handleOpenSignInDialog}>
              <AccountCircleIcon className={classes.icon} />
              Sign in
            </Button>
            <SignInDialog
              open={signInDialogOpen}
              onClose={this.handleCloseSignInDialog}
            />
          </div>
        </Landing>
      </Dashboard>
    );
  }
}
