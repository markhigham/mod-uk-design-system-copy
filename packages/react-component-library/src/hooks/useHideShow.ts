import { useCallback, useRef, useState } from 'react'

import { useDocumentClick } from '.'

export function useHideShow(
  isClick: boolean,
  closeDelay: number,
  initialIsVisible = false
) {
  const [isVisible, setIsVisible] = useState(initialIsVisible)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const floatingBoxChildrenRef = useRef(null)

  const hideElement = useCallback(() => {
    if (isVisible) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        setIsVisible(false)
      }, closeDelay)
    }
  }, [closeDelay, isVisible])

  function showElement() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
    }

    setIsVisible(true)
  }

  useDocumentClick(floatingBoxChildrenRef, hideElement, isClick)

  function getMouseEvents() {
    if (isClick) {
      return {
        onClick: isVisible ? hideElement : showElement,
      }
    }

    return { onMouseEnter: showElement, onMouseLeave: hideElement }
  }

  return {
    floatingBoxChildrenRef,
    isVisible,
    mouseEvents: getMouseEvents(),
  }
}
