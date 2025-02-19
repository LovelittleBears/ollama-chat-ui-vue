import { ref, nextTick } from "vue"

export function useScroll() {
  const scrollRef = ref(null)

  const scrollToBottom = async (smooth = false) => {
    await nextTick()
    if (scrollRef.value) {
      if (smooth)
        scrollRef.value.scrollTo({ top: scrollRef.value.scrollHeight, behavior: 'smooth' })
      else 
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
  }

  const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTop = 0
  }

  return {
    scrollRef,
    scrollToBottom,
    scrollToTop,
  }

}