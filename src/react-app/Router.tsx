import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'   // 插件自动生成

export default function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {useRoutes(routes)}
    </Suspense>)
}