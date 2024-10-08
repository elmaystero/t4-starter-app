import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useForceUpdate } from '@t4/ui'
import { appThemeKey, useAppTheme, useCurrentTheme, getStoredTheme } from 'app/atoms/theme'
import { ThemeVariant } from 'app/utils/theme'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useLayoutEffect } from 'react'
import { Appearance } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const TamaguiThemeProvider = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  const [appTheme, setAppTheme] = useAppTheme()
  const [currentTheme] = useCurrentTheme()
  const forceUpdate = useForceUpdate()

  const defaultTheme = 'system'
  const statusBarStyle = currentTheme === ThemeVariant.dark ? ThemeVariant.light : ThemeVariant.dark
  const themeValue = currentTheme === ThemeVariant.dark ? DefaultTheme : DefaultTheme

  useEffect(() => {
    getStoredTheme().then((t) => {
      if (t !== null) {
        setAppTheme(t as ThemeVariant)
      }
    })
  }, [])

  useEffect(() => {
    const systemThemeChangeListener = Appearance.addChangeListener(() => {
      setAppTheme(Appearance.getColorScheme() as ThemeVariant)
      forceUpdate()
    })
    return () => {
      systemThemeChangeListener.remove()
    }
  }, [setAppTheme, forceUpdate])

  useLayoutEffect(() => {
    async function myUseLayoutEffect() {
      const savedAppTheme = await AsyncStorage.getItem(appThemeKey)
      if (savedAppTheme !== undefined) {
        setAppTheme(savedAppTheme as ThemeVariant)
      }
    }
    myUseLayoutEffect()
  }, [setAppTheme])

  useEffect(() => {
    async function myUseEffect() {
      if (appTheme === undefined) {
        await AsyncStorage.setItem(appThemeKey, defaultTheme)
        setAppTheme(defaultTheme)
      } else {
        await AsyncStorage.setItem(appThemeKey, appTheme)
      }
    }

    myUseEffect()
  }, [appTheme, setAppTheme])

  return (
    <ThemeProvider value={themeValue}>
      <StatusBar style={statusBarStyle} />
      {children}
    </ThemeProvider>
  )
}

export const useRootTheme = () => {
  const [currentTheme] = useCurrentTheme()
  return [currentTheme]
}
