import React from 'react';
// Route : 특정 페이지에 접속 했을 때 어떤 페이지가 보여지는 지를 설정하는 라이브러리
import {HashRouter as Router, Route} from 'react-router-dom';
import AppShell from './AppShell';
import Home from './Home';
import Texts from './Texts';
import Words from './Words';

class App extends React.Component{
    render(){
        return(
            // Route는 Router내에 포함되어 있어야 함
            <Router>
                <AppShell>
                    <div>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/Texts" component={Texts}/>
                        <Route exact path="/Words" component={Words}/>
                    </div>
                </AppShell>
            </Router>
        );
    }
}

export default App;