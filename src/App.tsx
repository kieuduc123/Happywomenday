import { useEffect, useRef } from 'react'
import EditPage from './EditPage'
import { SCENE_HTML } from './sceneHtml'

export default function App() {
  const sceneMountedRef = useRef(false)
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const isEditPage = pathname === '/edit'

  useEffect(() => {
    if (isEditPage) {
      document.body.classList.remove('not-loaded')
      return
    }

    if (sceneMountedRef.current) {
      return
    }

    sceneMountedRef.current = true
    document.body.classList.add('not-loaded')

    void import('./scene-runtime')
  }, [isEditPage])

  if (isEditPage) {
    return <EditPage />
  }

  return <div id="scene-root" dangerouslySetInnerHTML={{ __html: SCENE_HTML }} />
}
