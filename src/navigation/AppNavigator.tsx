import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import WorldScreen from '../screens/WorldScreen';
import BaseScreen from '../screens/BaseScreen';
import CompanionScreen from '../screens/CompanionScreen';
import StoresScreen from '../screens/StoresScreen';
import LogsScreen from '../screens/LogsScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  World: '\u{1F5FA}',
  Base: '\u{1F3E0}',
  Companion: '\u{1F43E}',
  Stores: '\u{1F4E6}',
  Logs: '\u{1F4DC}',
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{TAB_ICONS[route.name]}</Text>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {route.name.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="World" component={WorldScreen} />
        <Tab.Screen name="Base" component={BaseScreen} />
        <Tab.Screen name="Companion" component={CompanionScreen} />
        <Tab.Screen name="Stores" component={StoresScreen} />
        <Tab.Screen name="Logs" component={LogsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainer,
    borderTopWidth: 1,
    borderTopColor: theme.colors.leylineBlue + '33',
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  tabItemActive: {
    opacity: 1,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 9,
    fontFamily: 'monospace',
    letterSpacing: 1,
    color: theme.colors.onSurfaceVariant,
  },
  tabLabelActive: {
    color: theme.colors.leylineBlue,
  },
});
