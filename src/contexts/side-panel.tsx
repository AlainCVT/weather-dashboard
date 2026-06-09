import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react'

type SidePanelState = 'open' | 'close'

export const SidePanelStateContext = createContext<{
  state: SidePanelState
  toggleState: (state?: SidePanelState) => void
}>({
  state: 'close',
  toggleState: () => {},
})

export function SidePanelStateProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<SidePanelState>('close')

  const toggleState = (state?: SidePanelState) => {
    if (typeof state === 'string') {
      setState(state)
    } else {
      setState((state) => (state === 'open' ? 'close' : 'open'))
    }
  }

  return (
    <SidePanelStateContext.Provider value={{ state, toggleState }}>
      {children}
    </SidePanelStateContext.Provider>
  )
}

export const useSidePanelState = () => {
  const state = useContext(SidePanelStateContext)

  return {
    ...state,
    isOpen: state.state === 'open',
  }
}
