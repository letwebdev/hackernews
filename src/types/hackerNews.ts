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

export interface List {
  readonly name: string
  readonly description: string
}
export type Lists = readonly List[]

export type LiveData = number[] | { items: number[]; profiles: string[] } | undefined
export interface ElementOfLiveDataSet {
  listName: string
  liveData: LiveData
}
export type LiveDataSet = ElementOfLiveDataSet[]
