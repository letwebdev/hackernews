import ItemPost from "../ItemPost.vue"
import type { Item } from "@/types/hackerNews"
/**
   TypeError: Cannot read properties of undefined (reading 'title')
 ❯ Proxy._sfc_render src/components/ItemPost.vue:35:17
     33|       >
     34|         <div class="i-mdi-web mr-8px mt-4px min-w-17.6px w-17.6px" />
     35|         {{ item.title }}
       |                 ^
     36|       </a>
     37|     </h2>
 */
test.todo("display post", () => {
  const testItem = {
    title: "test title",
    id: 123,
    by: "test user",
    time: 1709188472922,
    type: "story",
  } as const satisfies Item
  const wrapperOptions = {
    props: {
      item: testItem,
    },
  }
  const wrapper = mount(ItemPost, wrapperOptions)

  expect(wrapper.html()).toContain(testItem.title)
})
