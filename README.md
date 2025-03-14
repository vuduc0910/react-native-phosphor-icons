# @vuduc0801/react-native-phosphor-icons

Since [Phosphor](https://phosphoricons.com/) does not support React Native, we have to convert all the SVGs to React Native SVGs.

This package is heavily inspired by [duongdev/phosphor-react-native](https://github.com/duongdev/phosphor-react-native)

## Build

```
pnpm generate
pnpm build
```

## Usage

```javascript
import { View } from 'react-native'
import { Horse, Heart, Cube } from '@phosphor-icons/react'

const App = () => {
  return (
    <View>
      <Horse />
      <Heart color="#AE2983" weight="fill" size={32} />
      <Cube color="teal" weight="duotone" />
    </View>
  )
}
```

### Props

- color?: `string` – Icon stroke/fill color. Can be any CSS color string, including `hex`, `rgb`, `rgba`, `hsl`, `hsla`, named colors, or the special `currentColor` variable.
- size?: `number | string` – Icon height & width. As with standard React elements, this can be a number, or a string with units in `px`, `%`, `em`, `rem`, `pt`, `cm`, `mm`, `in`.
- weight?: `"fill" | "regular" | "bold"` – Icon weight/style. Can also be used, for example, to "toggle" an icon's state: a rating component could use Stars with weight="regular" to denote an empty star, and weight="fill" to denote a filled star.
- mirrored?: `boolean` – Flip the icon horizontally. Can be useful in RTL languages where normal icon orientation is not appropriate.
