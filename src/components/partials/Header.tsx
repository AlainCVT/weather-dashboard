import Icon from '@/components/icons/Icon'
import {
  ModulesLocationCityDropdown,
  ModulesMapTypeDropdown,
} from '@/components/modules'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { Button } from '@/components/ui/button'
import { useSidePanelState } from '@/contexts/side-panel'

export default function Header() {
  const { toggleState } = useSidePanelState()

  return (
    <header className="bg-background/80 border-b-accent sticky top-0 z-1 grid grid-flow-col items-center justify-between border-b pr-6 backdrop-blur-sm">
      <div className="no-scrollbar grid grid-flow-col justify-start gap-4 overflow-auto px-4 py-6">
        <ModulesLocationCityDropdown />
        <ModulesMapTypeDropdown />
      </div>
      <div className="before:from-background before:to-background/0 relative grid h-full grid-flow-col items-center gap-3 before:pointer-events-none before:absolute before:right-full before:h-full before:w-4 before:bg-linear-to-l">
        <ThemeSwitcher />
        <Button
          className="lg:hidden"
          variant="secondary"
          onClick={() => {
            toggleState('open')
          }}
        >
          <Icon name="Hamburger" size={16} className="text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
}
