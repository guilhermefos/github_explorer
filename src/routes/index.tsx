import React from 'react'
import { Switch, Route } from 'react-router-dom'

 import Dashbaord from '../pages/Dashboard'
 import Repository from '../pages/Repository'

 const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashbaord} />
    <Route path="/repository/:repository+" component={Repository} />
  </Switch>
 )

 export default Routes
 