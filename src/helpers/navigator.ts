export const isMac = (): boolean =>
  navigator.userAgentData?.platform === 'macOS' ||
  navigator.platform.toUpperCase().includes('MAC')
