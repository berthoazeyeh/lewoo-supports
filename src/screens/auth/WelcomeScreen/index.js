import { useCallback, useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { ActivityIndicator, Image, Text } from "react-native";
import { isDarkMode, updateSynchronisationDOWNStateStored, updateUserStored, useCurrentUser, useTheme } from "store";
import { backgroundImages, logo, showCustomMessage, Theme } from "utils";
import { createTable, db, getData, getDataM, LOCAL_URL } from "apis";
import { useDispatch } from "react-redux";
import { ThemeActionTypes } from "store/actions/ThemeAction";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Welcome = (props) => {
    const theme = useTheme()
    const { navigation } = props
    const dispatch = useDispatch()
    const user = useCurrentUser();
    console.log("Welcome-----------", user);

    const scheme = useColorScheme();

    useFocusEffect(
        useCallback(() => {
            tryToLoginParents()
            return () => {
                console.log("L'écran a perdu le focus");
            };
        }, [navigation])
    );
    useEffect(() => {
        dispatch({ type: ThemeActionTypes.SET_SYSTEM_THEME, payload: scheme });
    }, [dispatch, scheme]);

    const tryToLoginParents = async () => {
        createAllTable()
        try {
            const user_Parent_Id = user?.id
            if (user_Parent_Id) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AppStacks' }],
                })
                return;
            }
            if (!user_Parent_Id) {
                navigation.navigate("LoginScreen");

                return;
            }
            const response = await getDataM(`${LOCAL_URL}/api/res.partner/${user_Parent_Id}`)
            if (response?.success) {
                const data = response.data[0]
                const user1 = user
                dispatch(updateUserStored(user1))
                showCustomMessage("Success", `Authentification reuissi bienvenue Mr/Mme ${user?.name}`, "success", "center")
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AppStacks' }],
                })
            } else {
                navigation.navigate("LoginScreen");
            }
        } catch (error) {
            console.log("error", error);
            navigation.navigate("LoginScreen");
        }
    }

    const createAllTable = async () => {
        await createTable(db);
    }
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={useTheme().statusbar}
                barStyle={!isDarkMode() ? 'dark-content' : 'light-content'} />
            <View
                source={backgroundImages}
                style={styles.logo} />

            <View style={styles.boxContainerCenter}>
                <View style={{
                    backgroundColor: theme.primaryBackground, width: "80%", padding: 10,
                    borderRadius: 20, paddingBottom: 10, paddingHorizontal: 10,
                    gap: 10,
                }}>
                    <Image
                        source={logo}
                        style={styles.logos} />

                    <ActivityIndicator size={25} color={theme.primary} />
                    <Text style={{ textAlign: "center", ...Theme.fontStyle.montserrat.regular }}>Authentification en cours...</Text>

                </View>

            </View>
            <View style={styles.boxContainer}>
                <ActivityIndicator size={45} color={theme.primary} style={styles.loader} />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    boxContainer: {
        flex: 1,
        position: "absolute",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    boxContainerCenter: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
    },
    boxContainersCenter: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
    },
    logo: {
        resizeMode: "cover",
        position: "relative",
        width: "100%",
        height: "100%",
        flex: 1,
        backgroundColor: "#F5F5F5",

    },
    logos: {
        resizeMode: "contain",
        position: "relative",
        height: 100,
        alignSelf: "center",
    },
    loader: {
        marginVertical: 20,
    },
    text: {
        color: '#0C0C0C',
        fontSize: 16,
    },
    subText: {
        color: '#3700FF',
        fontSize: 18,
    },
});
export default Welcome