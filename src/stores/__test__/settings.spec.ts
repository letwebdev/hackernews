import { useSettingsStore } from "../settings"

describe("Settings Store", () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it("reset setting", () => {
    const store = useSettingsStore()
    store.settings.displayingItemId.value = false
    store.settingOperations.reset()
    expect(store.settings.displayingItemId.value).toBeTruthy()
  })
})
