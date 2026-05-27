import clsx from 'clsx'

type Props = {
  src: string
  size?: 'sm' | 'md' | 'lg'
}

export default function WeatherIcon({ src, size = 'md' }: Props) {
  return (
    <img
      src={`https://openweathermap.org/img/wn/${src}.png`}
      alt="Weather Icon"
      className={clsx(
        size === 'sm' && 'size-4',
        size === 'md' && 'size-8',
        size === 'lg' && 'size-12',
      )}
    />
  )
}
