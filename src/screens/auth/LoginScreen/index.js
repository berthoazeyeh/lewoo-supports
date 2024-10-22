import { TextInput, TouchableOpacity, View } from "react-native";
import { Image, Text } from "react-native"
import { changeLanguage, selectLanguageValue, updateUserStored, useIsSyncing, useTheme } from "store";
import { backgroundImages, showCustomMessage, Theme } from "utils"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { I18n } from 'i18n';
import { useState } from "react";
import dynamicStyles from "./style";
import { Button } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import useSWRMutation from 'swr/mutation'
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithPartner, DATABASE, LOCAL_URL, loginUserWithPartner, postData } from "apis";
import { useFocusEffect } from "@react-navigation/native";
import MyBanner from "components/MyBanner";

const schema = z.object({
    email: z.string()
        .min(5, I18n.t('Login.validation_email_invalid'))
        .regex(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, { message: I18n.t('Login.validation_email_invalid') }),
    password: z.string()
        .min(8, { message: I18n.t('Login.validation_password_too_short') })
});

const LoginScreen = (props) => {
    const { navigation } = props;
    const theme = useTheme()
    const styles = dynamicStyles(theme)
    const language = useSelector(selectLanguageValue);
    const dispatch = useDispatch()
    const form = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    const { trigger: loginPartner } = useSWRMutation(`${LOCAL_URL}/api/support/login`, postData)
    const isSynchronised = useIsSyncing();

    const [loading, setLoading] = useState(false)
    const [securePasswordEntry, setSecurePasswordEntry] = useState(true)


    const handleSubmit = async (data) => {
        // console.log(data);

        try {

            setLoading(true)
            loginUserWithPartner(data.email, data.password)
                .then(userWithPartner => {
                    console.log(userWithPartner, "userWithPartner");
                    dispatch(updateUserStored(userWithPartner))
                    setLoading(false)
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'AppStacks' }],
                    })
                    showCustomMessage("Success", "Authentification successful\n" + userWithPartner, "success", "center");
                    setLoading(false)
                })
                .catch(error => {
                    console.log("error################", error, data.password);
                    const dataLogin = {
                        login: data.email,
                        password: data.password,
                        db: DATABASE
                    }
                    const pass = data.password;
                    loginPartner(dataLogin).then(async (data) => {
                        console.log(data);

                        if (data?.success) {
                            const { email, id, name, partner_id, phone } = data?.data
                            showCustomMessage("Success", "Authentification successful\n" + data?.data?.name, "success", "center");
                            dispatch(updateUserStored(data.data))
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'AppStacks' }],
                            })
                            createUserWithPartner(id, name, email, pass, phone, "Admin", "", "", partner_id).then((e) => {
                                console.log("createUserWithPartner----", e);
                                setLoading(false)
                            }).catch((err) => {
                                console.log("createUserWithPartner----", err);
                            });
                        } else {
                            showCustomMessage("Avertisement", data?.message);
                        }
                        setLoading(false)
                    });
                });
        } catch (error) {
            console.log(error);
            showCustomMessage("Ave.rtisement", "error", "success", "center");
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <View
                source={backgroundImages}
                style={styles.logo}
            >
                <MyBanner refreshLocal={isSynchronised} theme={theme} />

            </View>
            <View style={styles.boxContainer}>
                <View style={styles.languageContainer}>
                    <Text style={styles.textlangauge}>{I18n.t("changeLanguage")}</Text>
                    <Picker
                        selectedValue={language}
                        onValueChange={(itemValue, itemIndex) => {
                            dispatch(changeLanguage(itemValue));
                        }}
                        style={{ width: 130, gap: 0, color: theme.primaryText, fontSize: 1, padding: 0 }}
                        dropdownIconColor={theme.primary}
                        mode="dropdown" >
                        <Picker.Item style={{ fontSize: 12, ...Theme.fontStyle.montserrat.bold }} label={I18n.t("Login.languageFrench")} value="fr" />
                        <Picker.Item style={{ fontSize: 12, ...Theme.fontStyle.montserrat.bold }} label={I18n.t("Login.languageEnglish")} value="en" />
                    </Picker >
                </View >
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
                        style={{ ...styles.loginButton, backgroundColor: loading ? theme.gray : theme.primary, flex: 1 }}
                        onPress={() => {
                            // navigation.reset({
                            //     index: 0,
                            //     routes: [{ name: 'AppStacks' }],
                            // })
                            if (!form.formState.isValid) {
                                console.log("----------------------", form.formState.isValid);
                                showCustomMessage("Information", "Tout les champs sont requis", "warning", "bottom")
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
                <View style={{ justifyContent: "flex-end", flexDirection: "row", flex: 1, alignSelf: "flex-end" }}>
                    <Text style={{ color: theme.primaryText }}>Pas de compte?</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('SignInScreen')
                    }}>
                        <Text style={{ paddingHorizontal: 10, color: "blue" }}>Créer un</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}


export default LoginScreen




