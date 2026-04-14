import { useEffect } from 'react'

/**
 * Adds .is-revealed class to all [data-reveal] elements when they enter the viewport.
 * Uses MutationObserver to automatically observe dynamically added elements.
 * Supports: data-reveal="up|left|right|zoom|fade" and data-delay="1-8"
 */
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            // Optionally unobserve after reveal to improve performance
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    )

    const observeElements = () => {
      // Only observe elements that haven't been revealed yet
      const elements = document.querySelectorAll('[data-reveal]:not(.is-revealed)')
      elements.forEach((el) => observer.observe(el))
    }

    // Initial observation
    observeElements()

    // Setup MutationObserver to watch for dynamically added elements
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldObserve = false
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          shouldObserve = true
        }
      })
      if (shouldObserve) {
        observeElements()
      }
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])
}
