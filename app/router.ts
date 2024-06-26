/* eslint-disable ember/no-classic-classes */
import EmberRouter from '@ember/routing/router';
import config from 'intro/config/environment';
import routes from './routes/routes';

interface RouteDef {
  [key: string]: {
    path: string;
  };
}

const routesT: RouteDef = routes;

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function () {
  Object.keys(routesT).forEach((routeName) => {
    const route = routesT[routeName];
    this.route(routeName, { path: route?.path });
  });
  this.route('index', { path: '/' });
  this.route('about');
});

export default Router;
