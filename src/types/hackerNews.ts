export interface Item {
  readonly by: string
  readonly id: number
  discuss: URL
  readonly poll: number
  readonly score: number
  readonly text: string
  readonly time: number
  readableTime: string
  readonly type: string
  readonly url?: string
  readonly title: string
  // TODO Solve dead item
}
export type Items = Item[]

export type ListName =
  | "topstories"
  | "newstories"
  | "beststories"
  | "askstories"
  | "showstories"
  | "jobstories"
  | "maxitem"
  | "updates"

export interface List {
  readonly name: ListName

  readonly description: string
}
export type Lists = readonly List[]

interface LiveDataOfChangedItems {
  items: number[]
  profiles: string[]
}
type maximumItemId = number
export type LiveData = number[] | maximumItemId | LiveDataOfChangedItems | undefined
export interface ElementOfLiveDataSet {
  listName: ListName
  liveData: LiveData
}
export type LiveDataSet = ElementOfLiveDataSet[]
