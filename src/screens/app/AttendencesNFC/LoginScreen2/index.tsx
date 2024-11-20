import { Linking, PermissionsAndroid, Platform, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "react-native"
import { selectLanguageValue, updateStoredtPosition, updateUserStored, useIsSyncing, userCurrentPosition, useTheme } from "store";
import { showCustomMessage } from "utils"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { I18n } from 'i18n';
import { useState, useEffect } from "react";
import dynamicStyles from "./style";
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from 'react-redux';
import useSWRMutation from 'swr/mutation'
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DATABASE, LOCAL_URL, LOCAL_URL1, postData, postData1 } from "apis";
import Geolocation from '@react-native-community/geolocation'
import { createUserWithPartner, loginUserWithPartner } from "apis/databaseAttend";

const schema = z.object({
    email: z.string()
        .min(5, I18n.t('Login.validation_email_invalid'))
        .regex(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, { message: I18n.t('Login.validation_email_invalid') }),
    password: z.string()
        .min(8, { message: I18n.t('Login.validation_password_too_short') })
});

const LoginScreen2 = (props: any) => {
    const { navigation } = props;
    const theme = useTheme()
    const styles = dynamicStyles(theme)
    const language = useSelector(selectLanguageValue);
    const dispatch = useDispatch()
    const position = userCurrentPosition()
    console.log(position);
    const form = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    const { trigger: loginPartner } = useSWRMutation(`${LOCAL_URL1}/api/attendance/login`, postData1)
    const isSynchronised = useIsSyncing();
    const [loading, setLoading] = useState(false)
    const [securePasswordEntry, setSecurePasswordEntry] = useState(true)
    useEffect(() => {
        androidPermissions()
    }, [loading])
    const openAppSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:')
        } else {
            Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
        }
    }
    const androidPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Enable Location Services',
                    message:
                        'Our app needs access to your location ' +
                        'so you can take awesome rides.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the location')
                Geolocation.getCurrentPosition(
                    (location) => {
                        dispatch(updateStoredtPosition({ latitude: location?.coords.latitude, longitude: location?.coords.longitude }))
                        console.log('location --', location)
                    },
                    error => {
                        if (!position) {
                            openAppSettings();
                        }
                        // showDialogToEnableLocation();
                        console.log({ errr: error })
                    },
                )
            } else {
                console.log(
                    'Location permission denied. The app cannot be used unless you enable location services.',
                )
            }
        } catch (err) {
            console.warn(err)
        }
    }


    const handleSubmit = async (data: any) => {
        try {

            setLoading(true)
            const localRes: any = await loginUserWithPartner(data.email, data.password);
            if (localRes.success) {
                dispatch(updateUserStored(localRes.data))
                showCustomMessage("Success", "Authentification successful\n", "success", "center");
                navigation.goBack();
                navigation.navigate('MakeManuelAttendences')
                setLoading(false)
            }
            else {
                console.log("error################", localRes);
                const dataLogin = {
                    login: data.email,
                    password: data.password,
                    db: 'aserp_16_neo_db'
                }
                const pass = data.password;
                loginPartner(dataLogin).then(async (data) => {
                    console.log(data);

                    if (data?.success && data.data.role === "admin") {
                        const { email, id, name, partner_id, phone, role } = data?.data
                        showCustomMessage("Success", "Authentification successful\n" + data?.data?.name, "success", "center");
                        dispatch(updateUserStored(data.data))
                        navigation.goBack();
                        navigation.navigate('MakeManuelAttendences')
                        createUserWithPartner(id, name, email, pass, phone, role, partner_id).then((e) => {
                            console.log("createUserWithPartner----", e);
                            setLoading(false)
                        }).catch((err) => {
                            console.log("createUserWithPartner----", err);
                        });
                    } else {
                        showCustomMessage("Avertisement", "Vous n'avez pas les authorisation pour effectuer ces  actions " + data?.message, 'warning', 'center');

                    }
                    setLoading(false)
                });
            }

        } catch (error) {
            console.log(error);
            showCustomMessage("Ave.rtisement", "error", "success", "center");
            setLoading(false)
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.boxContainer}>
                <Text style={styles.loginText1}>{"Veuillez entrer vos paramètres d'authentification."}</Text>
                <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <View>
                            <View style={styles.viewInputContent}>
                                <MaterialCommunityIcons name='email' size={27} color={fieldState.invalid ? theme.primary : "gray"} />
                                <TextInput
                                    style={styles.inputContainer}
                                    placeholderTextColor={theme.placeholderTextColor}
                                    onChange={() => (form.formState.isValid)}
                                    onChangeText={field.onChange}
                                    value={field.value || ''}
                                    placeholder={I18n.t("Login.username")}
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                                {!fieldState.invalid && <MaterialCommunityIcons
                                    name={"check"}
                                    size={24}
                                    color={theme.primary}
                                />}
                            </View>
                            {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                        </View>)} />
                <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <View>
                            <View style={styles.viewInputContent}>
                                <MaterialCommunityIcons name='lock' size={27} color={fieldState.invalid ? theme.primary : "gray"} />
                                <TextInput
                                    style={styles.inputContainer}
                                    placeholderTextColor={theme.placeholderTextColor}
                                    onChange={() => (form.formState.isValid)}
                                    onChangeText={field.onChange}
                                    value={field.value || ''}
                                    secureTextEntry={securePasswordEntry}
                                    placeholder={I18n.t("Login.password")}
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                    maxLength={16}
                                />
                                <TouchableOpacity onPress={() => setSecurePasswordEntry(!securePasswordEntry)}>
                                    <MaterialCommunityIcons
                                        name={securePasswordEntry ? 'eye-off' : 'eye'}
                                        size={24}
                                        color="gray"
                                    />
                                </TouchableOpacity>
                            </View>
                            {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                        </View>)} />
                <View style={styles.buttonContainer}>
                    <Button
                        style={{ backgroundColor: loading ? theme.gray : theme.primary, flex: 1 }}
                        onPress={() => {
                            // navigation.reset({
                            //     index: 0,
                            //     routes: [{ name: 'AppStacks' }],
                            // })
                            if (!form.formState.isValid) {
                                console.log("----------------------", form.formState.isValid);
                                // showCustomMessage("Information", "Tout les champs sont requis", "warning", "bottom")
                                form.handleSubmit(handleSubmit)();
                                return;
                            }
                            form.handleSubmit(handleSubmit)();
                        }
                        }
                        loading={loading}
                        disabled={loading}
                        elevation={3}
                        labelStyle={styles.buttonLabel}
                        mode="elevated"
                    >
                        <Text style={styles.loginText}>{I18n.t("Login.login")}</Text>
                    </Button>
                </View>


            </View>
        </View>
    )



}


export default LoginScreen2




