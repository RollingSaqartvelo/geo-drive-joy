/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

import { Route as rootRouteImport } from './routes/__root'
import { Route as ContactRouteImport } from './routes/contact'
import { Route as ToursRouteImport } from './routes/tours'
import { Route as CarsRouteImport } from './routes/cars'
import { Route as CarSlugRouteImport } from './routes/car.$slug'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as AdminIndexRouteImport } from './routes/admin.index'
import { Route as AdminCalendarRouteImport } from './routes/admin.calendar'
import { Route as AdminCarsRouteImport } from './routes/admin.cars'

const ContactRoute = ContactRouteImport.update({
  id: '/contact',
  path: '/contact',
  getParentRoute: () => rootRouteImport,
} as any)
const ToursRoute = ToursRouteImport.update({
  id: '/tours',
  path: '/tours',
  getParentRoute: () => rootRouteImport,
} as any)
const CarsRoute = CarsRouteImport.update({
  id: '/cars',
  path: '/cars',
  getParentRoute: () => rootRouteImport,
} as any)
const CarSlugRoute = CarSlugRouteImport.update({
  id: '/car/$slug',
  path: '/car/$slug',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const AdminRoute = AdminRouteImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => rootRouteImport,
} as any)
const AdminIndexRoute = AdminIndexRouteImport.update({
  id: '/admin/',
  path: '/',
  getParentRoute: () => AdminRoute,
} as any)
const AdminCalendarRoute = AdminCalendarRouteImport.update({
  id: '/admin/calendar',
  path: '/calendar',
  getParentRoute: () => AdminRoute,
} as any)
const AdminCarsRoute = AdminCarsRouteImport.update({
  id: '/admin/cars',
  path: '/cars',
  getParentRoute: () => AdminRoute,
} as any)

const AdminRouteWithChildren = AdminRoute._addFileChildren({
  AdminIndexRoute,
  AdminCalendarRoute,
  AdminCarsRoute,
})

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/cars': typeof CarsRoute
  '/car/$slug': typeof CarSlugRoute
  '/tours': typeof ToursRoute
  '/contact': typeof ContactRoute
  '/admin': typeof AdminRoute
  '/admin/': typeof AdminIndexRoute
  '/admin/calendar': typeof AdminCalendarRoute
  '/admin/cars': typeof AdminCarsRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/cars': typeof CarsRoute
  '/car/$slug': typeof CarSlugRoute
  '/tours': typeof ToursRoute
  '/contact': typeof ContactRoute
  '/admin': typeof AdminRoute
  '/admin/': typeof AdminIndexRoute
  '/admin/calendar': typeof AdminCalendarRoute
  '/admin/cars': typeof AdminCarsRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/cars': typeof CarsRoute
  '/car/$slug': typeof CarSlugRoute
  '/tours': typeof ToursRoute
  '/contact': typeof ContactRoute
  '/admin': typeof AdminRoute
  '/admin/': typeof AdminIndexRoute
  '/admin/calendar': typeof AdminCalendarRoute
  '/admin/cars': typeof AdminCarsRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/cars' | '/car/$slug' | '/tours' | '/contact' | '/admin' | '/admin/' | '/admin/calendar' | '/admin/cars'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/cars' | '/car/$slug' | '/tours' | '/contact' | '/admin' | '/admin/' | '/admin/calendar' | '/admin/cars'
  id: '__root__' | '/' | '/cars' | '/car/$slug' | '/tours' | '/contact' | '/admin' | '/admin/' | '/admin/calendar' | '/admin/cars'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CarsRoute: typeof CarsRoute
  CarSlugRoute: typeof CarSlugRoute
  ToursRoute: typeof ToursRoute
  ContactRoute: typeof ContactRoute
  AdminRoute: typeof AdminRouteWithChildren
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/contact': { id: '/contact'; path: '/contact'; fullPath: '/contact'; preLoaderRoute: typeof ContactRouteImport; parentRoute: typeof rootRouteImport }
    '/tours': { id: '/tours'; path: '/tours'; fullPath: '/tours'; preLoaderRoute: typeof ToursRouteImport; parentRoute: typeof rootRouteImport }
    '/cars': { id: '/cars'; path: '/cars'; fullPath: '/cars'; preLoaderRoute: typeof CarsRouteImport; parentRoute: typeof rootRouteImport }
    '/car/$slug': { id: '/car/$slug'; path: '/car/$slug'; fullPath: '/car/$slug'; preLoaderRoute: typeof CarSlugRouteImport; parentRoute: typeof rootRouteImport }
    '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/admin': { id: '/admin'; path: '/admin'; fullPath: '/admin'; preLoaderRoute: typeof AdminRouteImport; parentRoute: typeof rootRouteImport }
    '/admin/': { id: '/admin/'; path: '/'; fullPath: '/admin/'; preLoaderRoute: typeof AdminIndexRouteImport; parentRoute: typeof AdminRoute }
    '/admin/calendar': { id: '/admin/calendar'; path: '/calendar'; fullPath: '/admin/calendar'; preLoaderRoute: typeof AdminCalendarRouteImport; parentRoute: typeof AdminRoute }
    '/admin/cars': { id: '/admin/cars'; path: '/cars'; fullPath: '/admin/cars'; preLoaderRoute: typeof AdminCarsRouteImport; parentRoute: typeof AdminRoute }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute,
  CarsRoute,
  CarSlugRoute,
  ToursRoute,
  ContactRoute,
  AdminRoute: AdminRouteWithChildren,
}

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
