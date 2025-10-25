/// <reference types="vite/client" />
declare module '~react-pages' {
  export interface CustomRouteObject extends Omit<RouteObject, 'children'> {
    path?: string;
    name?: string;
    meta?: { title?: string };
    children?: CustomRouteObject[];
  }
  const routes: CustomRouteObject[];
  export default routes;
}
declare module '*.module.less' {
  import { ClassNames } from 'typescript-plugin-css-modules';
  const classes: ClassNames;
  export default classes;
}