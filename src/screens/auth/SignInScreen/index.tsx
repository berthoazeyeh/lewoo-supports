import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { updateUserStored, useTheme } from "store";
import dynamicStyles from "./style";
import { ActivityIndicator, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { logo, showCustomMessage, Theme } from "utils";
import { I18n } from 'i18n';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useSWR from "swr";

import { createUserWithPartner, getData, LOCAL_URL, postData } from "apis";
import useSWRMutation from 'swr/mutation'
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from "react-redux";
import { CustomerLoader } from "components";

const schema = z.object({
    name: z.string()
        .min(5, I18n.t('Login.validation_username_too_short')),
    phoneNumber: z.string()
        .min(9, I18n.t('Login.validation_phoneNumber_too_short')),
    email: z.string()
        .min(5, I18n.t('Login.validation_email_invalid'))
        .regex(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, { message: I18n.t('Login.validation_email_invalid') }),
    password: z.string()
        .min(8, { message: I18n.t('Login.validation_password_too_short') })

});

function SignInScreen(props: any): React.JSX.Element {
    const { navigation } = props;
    const theme = useTheme();
    const styles = dynamicStyles(theme);
    const dispatch = useDispatch();

    const form = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    const [loading, setLoading] = useState(false);

    const [securePasswordEntry, setSecurePasswordEntry] = useState(true);

    const { trigger: createNewUser } = useSWRMutation(`${LOCAL_URL}/api/support/register`, postData)



    const handleSubmittedFormuler = async (data: any) => {
        // console.log(data);

        setLoading(true);
        const parrentData = {
            phone: data.phoneNumber,
            email: data.email,
            name: data.name,
            password: data.password,
        }
        const response = await createNewUser(parrentData)
        console.log(response);

        if (response.success) {
            const id = response.data.id;
            const partner_id = response.data.partner_id;
            createUserWithPartner(id, data.name, data.email, data.password, data.phoneNumber, "", data.phoneNumber, "", partner_id).then((res: any) => {
                showCustomMessage("Succes", res.message, 'success', "center");
                const data = res.data;
                dispatch(updateUserStored(data))
                setLoading(false)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AppStacks' }],
                })
            }).catch((err: any) => {
                setLoading(false)
                console.log(err);
                showCustomMessage("Information", err.message, "warning", "bottom")
            });


        } else {
            setLoading(false)
            showCustomMessage("Information", response.message, "warning", "bottom")
        }



    }
    useEffect(() => {
        setLoading(false);

    }, [])

    return (
        <View style={styles.container}>
            <ScrollView>


                <Image
                    source={logo}
                    resizeMode="contain"
                    style={{
                        width: 200,
                        height: 150,
                        marginBottom: 30,
                        alignSelf: "center",
                    }}
                />

                <Text style={styles.title}>{I18n.t('Register.title')}</Text>
                <View style={{ gap: 10 }}>


                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => {

                            return <View >
                                <View style={styles.inputContainer}>
                                    <Icon name="person" size={24} style={styles.icon} />
                                    <TextInput
                                        placeholder={I18n.t('Register.name')}
                                        style={styles.input}
                                        onChange={() => (form.formState.isValid)}
                                        onChangeText={field.onChange}
                                        placeholderTextColor={theme.placeholderTextColor}

                                        value={field.value || ''}
                                        underlineColor={theme.primaryBackground}
                                    />
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                            </View>
                        }} />



                    <Controller
                        control={form.control}
                        name="phoneNumber"
                        render={({ field, fieldState }) => (<View>

                            <View style={styles.inputContainer}>
                                <Icon name="phone" size={24} style={styles.icon} />
                                <TextInput
                                    placeholder={I18n.t('Register.phone')}
                                    style={styles.input}
                                    value={field.value}
                                    onChange={() => (form.formState.isValid)}
                                    onChangeText={field.onChange}
                                    placeholderTextColor={theme.placeholderTextColor}

                                    keyboardType="phone-pad"
                                    underlineColorAndroid="transparent"
                                    underlineColor={theme.primaryBackground}

                                />
                            </View>
                            {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}

                        </View>)} />



                    <Controller
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <View>
                                <View style={styles.inputContainer}>
                                    <Icon name="email" size={24} style={styles.icon} />
                                    <TextInput
                                        placeholder="Email"
                                        style={styles.input}
                                        value={field.value}
                                        onChange={() => (form.formState.isValid)}
                                        onChangeText={field.onChange}
                                        placeholderTextColor={theme.placeholderTextColor}

                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        underlineColorAndroid="transparent"
                                        underlineColor={theme.primaryBackground}

                                    />
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}

                            </View>

                        )} />

                    <Controller
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <View>

                                <View style={styles.inputContainer}>
                                    <Icon name="lock" size={24} style={styles.icon} />
                                    <TextInput
                                        placeholder={I18n.t('Register.password')}
                                        style={styles.input}
                                        value={field.value}
                                        onChange={() => (form.formState.isValid)}
                                        onChangeText={field.onChange}
                                        placeholderTextColor={theme.placeholderTextColor}
                                        underlineColorAndroid="transparent"
                                        underlineColor={theme.primaryBackground}
                                        secureTextEntry={securePasswordEntry}
                                    />
                                    <TouchableOpacity onPress={() => setSecurePasswordEntry(!securePasswordEntry)}>
                                        <MaterialCommunityIcons
                                            name={securePasswordEntry ? 'eye-off' : 'eye'}
                                            size={24}
                                            style={styles.icon1}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}

                            </View>
                        )} />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => {
                    if (!form.formState.isValid) {
                        console.log("----------------------", form.formState.isValid);
                        showCustomMessage("Information", I18n.t('Register.all_fields_required'), "warning", "bottom")
                        form.handleSubmit(handleSubmittedFormuler)();

                        return;
                    }
                    form.handleSubmit(handleSubmittedFormuler)();
                }}>
                    <Text style={styles.buttonText}> {I18n.t('Register.signing')}
                    </Text>
                </TouchableOpacity>
                <CustomerLoader loading={loading} theme={theme} I18n={I18n} color={theme.primary} />
            </ScrollView>
        </View>
    );
}
export default SignInScreen;

