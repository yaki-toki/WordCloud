import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton'; 
import MenuIcon from '@material-ui/icons/Menu';

// CSS 작업
const styles = {
    root:{
        flexGrow: 1,
    },
    menuButton:{
        marginRight: 'auto'
    }
}

class AppShell extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            toggle: false
        };
    }
    handleDrawerToggle = () => this.setState({toggle: !this.state.toggle})
    render(){
        const {classes} = this.props;
        return(
            // div태그와 메뉴바
            <div className = {classes.root}>
                <AppBar position="static">
                    <IconButton className = {classes.menuButton} color="inherit" onClick={this.handleDrawerToggle}>
                        <MenuIcon/>
                    </IconButton>
                </AppBar>
                <Drawer open = {this.state.toggle}>
                    <MenuItem onClick = {this.handleDrawerToggle}>Home</MenuItem>
                </Drawer>
            </div>
        )
    }
}

// withStyles로 AppShell을 감싸서 보내야 스타일 적용이 가능
export default withStyles(styles)(AppShell);