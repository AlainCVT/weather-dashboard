import { ThemeContext } from '@/contexts/theme'
import { useContext } from 'react'

import Icon from '@/components/icons/Icon'
import { Switch } from '@/components/ui/switch'

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <div className="text-muted-foreground flex items-center gap-1">
      <Icon name="Theme/Light" size={16} />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={() => {
          toggleTheme()
        }}
      />
      <Icon name="Theme/Dark" size={16} />
    </div>
  )
}
