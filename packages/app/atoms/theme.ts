import AsyncStorage from '@react-native-async-storage/async-storage'
import { type CurrentThemeVariant, ThemeVariant } from 'app/utils/theme'
import { atom, useAtom } from 'jotai'
import { Appearance } from 'react-native'

export const appThemeKey = 'appTheme'

// Helper function to fetch theme from AsyncStorage
export async function getStoredTheme(): Promise<ThemeVariant | null> {
  try {
    const storedTheme = await AsyncStorage.getItem(appThemeKey)
    return storedTheme ? (storedTheme as ThemeVariant) : null
  } catch (error) {
    console.error('Error fetching theme from AsyncStorage:', error)
    return null
  }
}

// Atom to store the theme, initialized to 'light'
const appThemeAtom = atom<ThemeVariant>('system')

export function useAppTheme() {
  return [...useAtom(appThemeAtom)] as const
}

const currentThemeAtom = atom<CurrentThemeVariant>((get) => {
  const userTheme = get(appThemeAtom)
  if (userTheme === ThemeVariant.system) {
    return Appearance.getColorScheme() as CurrentThemeVariant
  }
  return userTheme
})

export function useCurrentTheme() {
  return [...useAtom(currentThemeAtom)] as const
}
