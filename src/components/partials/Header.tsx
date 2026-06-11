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
    <header className="bg-background/80 border-accent sticky top-0 z-1 grid grid-flow-col items-center justify-between border border-r-0 backdrop-blur-sm">
      <div className="no-scrollbar grid grid-flow-col justify-start gap-4 overflow-auto px-6 py-4">
        <ModulesLocationCityDropdown />
        <ModulesMapTypeDropdown />
      </div>
      <div className="border-accent grid h-full grid-flow-col items-center gap-3 border-l px-6">
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
