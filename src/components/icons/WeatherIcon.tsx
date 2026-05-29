import clsx from 'clsx'
import type { ImgHTMLAttributes } from 'react'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  size?: 'sm' | 'md' | 'lg'
}

export default function WeatherIcon({
  src,
  size = 'md',
  className,
  ...props
}: Props) {
  return (
    <img
      src={`https://openweathermap.org/img/wn/${src}.png`}
      alt="Weather Icon"
      className={clsx(
        className,
        size === 'sm' && 'size-4',
        size === 'md' && 'size-8',
        size === 'lg' && 'size-12',
      )}
      {...props}
    />
  )
}
