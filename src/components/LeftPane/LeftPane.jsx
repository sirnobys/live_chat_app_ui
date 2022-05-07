import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Logout from "../Forms/Logout";
import { useContext } from "react";
import { FormContext } from "../../context/FormContext";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          <span>{children}</span>
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const getUser = (user) => {
  return (
    <div
      className="chat col-lg-12"
      style={{
        backgroundColor: "white",
      }}
    >
      <div className="chat-header clearfix">
        <div className="row">
          <div className="col-lg-6">
            <a href="#">
              <img src={user?.picture} alt="avatar" />
            </a>
            <span className="float-right">
              <Logout />
            </span>
            <div className="chat-about">
              <h6 className="mt-3" style={{ fontSize: "10px" }}>
                {user.display_name}<br/>
                {user.email.split("@")[0]}
              </h6>
            </div>
          </div>
          <div className="col-lg-6"></div>
        </div>
      </div>
    </div>
  );
};

const drawerWidth = 240;

export default function LeftPane() {
  const { socket, block, myBlockList, otherBlockList, setBlockList, messages, user, setChatInfo, activeUsers, users } = useContext(FormContext);
  // let blockList={}
  // let otherBlockList={}
  const name = `${user.name.split(" ")[0]} ${user.family_name}`;
  const filterUser = activeUsers.filter(e=>e.email!==user.email)
  user["display_name"] = name;
  
  React.useEffect(()=>{
    socket.emit("activate_user", user)
  },[])
  

  
  const email = () => {
    console.log("other",otherBlockList);
    console.log("user",users);
    return (
      <div>
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div id="plist" className="people-list">
                <ul className="list-unstyled chat-list mt-2 mb-0">
                  {users?.map((e,i) => (
                    e.email !==user.email && !otherBlockList[user.email]?.split("/").includes(e.email) &&
                    <li key={i} className="clearfix" onClick={() => setChatInfo(e)}>
                      <img
                        src={e.picture}
                        alt="avatar"
                      />
                      <div className="about">
                        <div className="name mt-3">{e.name}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const online_users = () => {
    console.log(activeUsers);
    return (
      <div>
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div id="plist" className="people-list">
                <ul className="list-unstyled chat-list mt-2 mb-0">
                {filterUser.length>0? filterUser.map((e) => (
                  !otherBlockList[user.email]?.split("/").includes(e.email) &&
                    <li className="clearfix" onClick={() => setChatInfo(e)}>
                      <img
                        src={e.picture}
                        alt="avatar"
                      />
                      <div className="about">
                        <div className="name">{e.name}</div>
                        <div className="status">
                          <i className="fa fa-circle online"></i> online{" "}
                        </div>
                      </div>
                    </li>
                  )): "No online users"}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  function LeftPaneTab() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <div sx={{ width: "100%" }}>
        <div>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Email" {...a11yProps(0)} />
            <Tab label="Online Status" {...a11yProps(1)} />
          </Tabs>
        </div>
        <TabPanel value={value} index={0}>
          {email()}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {online_users()}
        </TabPanel>
      </div>
    );
  }

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {getUser(user)}
        <LeftPaneTab />
      </Drawer>
    </>
  );
}
