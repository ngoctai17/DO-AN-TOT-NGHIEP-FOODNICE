import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNav } from '../components';
import {
    Image,
    Text,
    View
} from 'react-native';

import {
    StartScreen,
    LogIn,
    Register,
    Home,
    Search,
    Cart,
    Profile,
    Category,
    ProductDetail,
    OrderShipment,
    Favorite,
    Order,
    Splash,
    ChangeAddress,
    OrderDetail,
    Comment,
    Account,
    ForgotPassword,
    Menu,
    SendOTP,
    Success,
    Payment
} from '../stacks';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const forFade = ({ current }) => ({
    cardStyle: {
        opacity: current.progress,
    },
});

const MainApp = () => {
    return (
        <Tab.Navigator tabBar={props => <BottomNav {...props} />}>
            <Tab.Screen name="Home" component={Home} options={{headerShown: false}} />
            <Tab.Screen name="Search" component={Search} options={{headerShown: false}} />
            <Tab.Screen name="Menu" component={Menu} options={{headerShown: false}} />
            <Tab.Screen name="Profile" component={Profile} options={{headerShown: false}} />
        </Tab.Navigator>
    );
};

const Router = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Splash"
                component={Splash}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Start Screen"
                component={StartScreen}
                options={{
                    cardStyleInterpolator: forFade,
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Log In"
                component={LogIn}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="MainApp"
                component={MainApp}
                options={{
                    cardStyleInterpolator: forFade,
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
            <Stack.Screen
                name="Category"
                component={Category}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="Payment"
                component={Payment}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="Cart"
                component={Cart}
                options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
                name="Product Detail"
                component={ProductDetail}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Order Shipment"
                component={OrderShipment}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Order"
                component={Order}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ChangeAddress"
                component={ChangeAddress}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="OrderDetail"
                component={OrderDetail}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Comment"
                component={Comment}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Account"
                component={Account}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Favorite"
                component={Favorite}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SendOTP"
                component={SendOTP}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Success"
                component={Success}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default Router;
