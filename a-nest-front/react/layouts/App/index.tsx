import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import loadable from '@loadable/component';
// import LogIn from '@pages/LogIn';
// import SignUp from '@pages/SignUp';

//워크스페이스 만들기 + 로그아웃하기 (5:12) 코드스플린팅
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));
// const Channel = loadable(() => import('@pages/Channel'));
// const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      {/* <Route path="/workspace/sleact" component={Workspace} /> */}
      {/* <Route path="/workspace/:workspace/channel/:channel" component={Workspace} /> */}
      <Route path="/workspace/:workspace" component={Workspace} />
      
      {/* <Route path="/workspace/channel" component={Channel} /> */}
      {/* <Route path="/workspace/dm" component={DirectMessage} /> */}

    </Switch>
  )
};




/* const App = () => {
  return <div>초기 세팅입니다.</div>;
}; */


export default App;
