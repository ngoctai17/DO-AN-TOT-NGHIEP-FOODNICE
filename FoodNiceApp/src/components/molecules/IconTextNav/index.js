import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { IconContainer, Space } from '../../atoms';
import ListText from '../ListText';

const IconTextNav = ({
  onPress,
  icon = '👻',
  text = '',
  hideIcon,
  width = 20,
  size,
  fontFam,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? 'rgba(151, 151, 151, 0.1)' : '#F8F9FE',
        },
      ]}>
      <View style={styles.iconTextNavContainer}>
        <View style={styles.iconTextContainer}>
          {hideIcon ? (
            <></>
          ) : (
            <>
              <IconContainer>
                <Text style={{ fontSize: 26 }}>{icon}</Text>
              </IconContainer>
              <Space width={width} />
            </>
          )}
          <ListText text={text} size={size} fontFam={fontFam} />
        </View>
        {/* <IconContainer>
          <Image source={require('../../../assets/icons/icon-right.png')} />
        </IconContainer> */}
      </View>
    </Pressable>
  );
};

export default IconTextNav;

const styles = StyleSheet.create({
  iconTextNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 66,
    paddingHorizontal: 18,
  },
  iconTextContainer: {
    flexDirection: 'row',
  },
});
