import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const useStyles = withStyles(theme => ({
  text: {
    marginBottom: theme.spacing.double,
  },
}));

function Paragraph({ classes, ...props }) {
  return <Typography className={classes.text} variant="body1" {...props} />;
}

export default useStyles(Paragraph);
