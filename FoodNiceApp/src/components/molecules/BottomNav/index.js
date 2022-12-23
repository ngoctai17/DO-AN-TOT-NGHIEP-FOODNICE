import React from 'react';
import {
  Image,
  Text,
  View,
  SafeAreaView
} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

const Icon = ({ label, focus }) => {
  switch (label) {
    case 'Home':
      return focus ? <Image source={require('../../../assets/icons/icon_home_active.png')} /> : <Image source={require('../../../assets/icons/icon_home.png')} />;
    case 'Search':
      return focus ? <Image source={require('../../../assets/icons/icon_search_active.png')} /> : <Image source={require('../../../assets/icons/icon_search.png')} />;
    case 'Menu':
      return focus ? <Image source={require('../../../assets/icons/icon-menu-active.png')} /> : <Image source={require('../../../assets/icons/icon-menu.png')} />;
    case 'Profile':
      return focus ? <Image source={require('../../../assets/icons/icon_profile_active.png')} /> : <Image source={require('../../../assets/icons/icon_profile.png')} />;
    default:
      return <Image source={require('../../../assets/icons/icon_home.png')} />;
  }
};

const BottomNav = ({ state, descriptors, navigation }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#F8F9FE' }}>
      <View
        style={{
          flexDirection: 'row',
          minHeight: 40,
          paddingVertical: 15,
          paddingHorizontal: 30,
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          marginHorizontal: 10,
          marginVertical: 10,
          borderRadius: 18
        }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableScale
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'space-between',
                paddingHorizontal: 8,
              }}>

              <View style={{
                flexDirection: 'row',
                backgroundColor: isFocused ? '#FEECEF' : '#fff',
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderRadius: 18
              }}>
                <Icon label={label} focus={isFocused} />
                {isFocused ? (
                  <Text style={{ marginTop: 5, marginLeft: 10, color: '#FF375B' }}>{label}</Text>
                ) : (
                  <></>
                )}
              </View>
            </TouchableScale>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default BottomNav;
