import { StyleProp, ViewStyle } from 'react-native'

export type IconWeight = 'regular' | 'fill' | 'bold'

export type IconProps = {
  color?: string
  size?: number | string
  weight?: IconWeight
  mirrored?: boolean
  style?: StyleProp<ViewStyle>
}
