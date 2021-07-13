import React from 'react'
import Header from '../../components/Header/Header'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Pending from './Pending/Pending';
import History from './History/History';

function TabPanel(props) {
  
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{paddingTop:'130px',background:'#29314570'}}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function Leave() {

  const classes = useStyles();
  const [value, setValue] = React.useState(0);//handling tab state

  //change handler for tab switching provided by material ui
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>

      {/* Header component with title as a prop */}
      <Header title='Leave Management Portal'/>
      <div className={classes.root} style={{position:'relative'}}>

        {/* tabs */}
        <AppBar position="static" style={{position:'fixed', top:'92px', left:'101px', background:'#293145'}}>
            <Tabs value={value} onChange={handleChange} aria-label='simple tabs example'>
                <Tab label="Pending" {...a11yProps(0)} />
                <Tab label="History" {...a11yProps(1)} />
            </Tabs>
        </AppBar>

        {/* Tab body */}
        <TabPanel value={value} index={0}>
            <Pending/>
        </TabPanel>
        <TabPanel value={value} index={1}>
            <History/>
        </TabPanel>
      </div>
    </div>
  )
}

export default Leave
