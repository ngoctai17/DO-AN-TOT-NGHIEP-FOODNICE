import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect } from 'react';
import { getData } from '../../utils';
import 'react-native-gesture-handler';
import Lottie from 'lottie-react-native';

const Splash = ({ navigation }) => {

    // const exampleJWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYzOTMwYTI0ODgyMzEwYmE0NDM0ODNhNCIsImVtYWlsIjoibmdvY3RhaUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCRUZVNWZWFFRWF3aHVzNnNNcXJQWjVPVm5yU0JNemw1SGhCMk1VOEo4Z1dSdnRNSGp3TU9RYSIsIm5hbWUiOiJuZ29jdGFpIiwicGhvbmUiOiIxMjMiLCJpbWFnZSI6Imh0dHBzOi8vZG9hbnRvdG5naGllcGZvb2QuaGVyb2t1YXBwLmNvbS9pbWFnZXMvaW1hZ2UtMTY2OTcxMDE0ODg4NS03MDk4OTY0NzEtYXZhdGFyLmpwZyIsIk9UUCI6IiIsInJvbGUiOiJVc2VyIiwic3RhdHVzRW1haWwiOmZhbHNlLCJibG9jayI6ZmFsc2UsIl9fdiI6MH0sImlhdCI6MTY3MTAxMjk5N30.PGtXeSz7uxN7D3NMsxzaZmTOLGNKQe4Co6HQJwpnjd8`;

    // function getPayload(jwt) {
    //     return atob(jwt.split(".")[1])
    // }

    // const payload = getPayload(exampleJWT);

    // const expiration = new Date(payload.exp);
    // const now = new Date();
    // const fiveMinutes = 1000 * 60 * 5;

    // if (expiration.getTime() - now.getTime() < fiveMinutes) {
    //     console.log("JWT has expired or will expire soon");
    // } else {
    //     console.log("JWT is valid for more than 5 minutes", payload);
    // }

    useEffect(() => {
        getData('user')
            .then(user => {
                // console.log(token)
                setTimeout(() => {
                    if (user) {
                        navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
                    }
                }, 1000);
            });
    }, []);

    return (
        // <SafeAreaView>
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Lottie style={styles.image} source={require('../../assets/animations/food-splash.json')} autoPlay loop />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.textYourFood}>All your favorites</Text>
                <Text style={styles.textFindFood}>Order from the best local restaurants</Text>
                <Text style={styles.textFindFood}>with easy, on-demand delivery.</Text>
            </View>

            <TouchableOpacity>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button}
                        onPress={() => navigation.navigate("Start Screen")}>
                        <Text style={styles.next}>Get Started</Text>
                    </Pressable>
                </View>
            </TouchableOpacity>
        </View>
        // </SafeAreaView>
    )
}

export default Splash

const styles = StyleSheet.create({
    next: {
        color: 'white',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20
    },
    button: {
        height: 57,
        width: 157,
        backgroundColor: '#FC5878',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: '10%',
        alignItems: 'center',
    },
    textFindFood: {
        fontSize: 12,
        fontWeight: '400',
        color: '#000000',
        lineHeight: 21
    },
    textYourFood: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#010F07',
        textAlign: 'center',
    },
    textContainer: {
        alignItems: 'center',
        marginTop: '5%',
    },
    image: {
        width: '100%',
        height: 250
    },
    imageContainer: {
        marginTop: '40%',
        alignItems: 'center'//ngang
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // width: '100%',
        // height: '100%'
    },
})