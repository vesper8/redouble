/* @flow */

import React from 'react';
import Router from 'react-router';
var { Route, DefaultRoute, RouteHandler, Link } = Router;

import {Table} from './table/table.jsx';
import {AboutView} from './about/about.jsx';
import {SettingsView} from './settings/settings.jsx';
import {GrowlContainer} from './growl/growl.jsx';

/* these should probably be somewhere else */
import a from 'necolas/normalize.css';
import b from 'purecss/build/pure.css!';
import c from 'FortAwesome/Font-Awesome/css/font-awesome.css!';
import d from './app.css!';

export class App extends React.Component {
   constructor(props) {
      super(props);
      this.state = { route: "table" };
   }

   routeClicked(route) {
      this.setState({"route": route});
      return false;
   }

   render() {
      console.log('rendering app')
      var routes = ["table", "settings", "about"].map((route) => {
         return (
            <li key={route}>
               <Link to={route}>{route}</Link>
            </li>
         );
      });

      return (
         <div className="app-container">
            <nav role="navigation" className="app-navbar nav-main">
               <ul className="nav-site">
                  {routes}
               </ul>
            </nav>
            <div className="app-content">
               <RouteHandler/>
            </div>
            <div className="app-growl">
               <GrowlContainer/>
            </div>
         </div>
      );
   }
}

var routes = (
   <Route handler={App} path="/">
      <DefaultRoute name="table" handler={Table} />
      <Route name="about" handler={AboutView} />
      <Route name="settings" handler={SettingsView} />
   </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
   React.render(<Handler/>, document.body);
});
