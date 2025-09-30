declare module 'sortablejs' {
  interface SortableOptions {
    animation?: number
    ghostClass?: string
    onEnd?: (evt: any) => void
  }

  class Sortable {
    constructor(element: HTMLElement, options?: SortableOptions)
  }

  export = Sortable
}