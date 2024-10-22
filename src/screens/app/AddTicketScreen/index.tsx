import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { updateSynchronisationDOWNStateStored, updateSynchronisationUPStateStored, useCurrentUser, useIsSyncing, useTheme } from "store";
import { useDispatch } from "react-redux";
import { Header } from "./components";
import dynamicStyles from "./style";
import { CreateRequest, getdata, getTypesByCategory } from "apis";
import * as z from 'zod';
import { I18n } from 'i18n';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerLoader } from "components";
import Icon from "react-native-vector-icons/MaterialIcons";
import { TextInput } from "react-native";
import { showCustomMessage, Theme } from "utils";
import { Picker } from "@react-native-picker/picker";
import { Searchbar } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyBanner from "components/MyBanner";

const schema = z.object({
    categorie: z.number(),
    type: z.number(),
    conpany: z.number(),
    text: z.string()
        .min(10, I18n.t('Login.validation_phoneNumber_too_short')),
    partner: z.number()


});



const AddTicketScreen = (props: any): React.JSX.Element => {
    const theme = useTheme()
    const { navigation } = props
    const dispatch = useDispatch()
    const user = useCurrentUser();
    const styles = dynamicStyles(theme);

    const handleSubmittedFormuler = async (data: any) => {
        setLoading(true)
        // console.log(",,,,,,,,,,", data);
        CreateRequest(data.categorie, user.partner_id, data?.partner, data.type, data.text, data?.conpany).then((res: any) => {
            if (res.success) {
                navigation.goBack()
                dispatch(updateSynchronisationUPStateStored(false));
                dispatch(updateSynchronisationUPStateStored(true));
            } else {
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        }).catch((err) => {
            console.log(",,,,,,,,,,", err);
            showCustomMessage("Erreur", "Erreur lors de la création de la requête", "error", "bottom")
            setLoading(false)
        })

    }
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPartner, setSelectedPartner] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [loadingType, setLoadingType] = useState(false);
    const [loadingCats, setLoadingCats] = useState(false);
    const [isLoadingPartner, setIsLoadingPartner] = useState(false);
    const [isLoadingCompany, setIsLoadingCompany] = useState(false);
    const [type, setType] = useState<any[]>([]);
    const [cats, setCats] = useState<any[]>([]);
    const [allPartners, setAllPartners] = useState<any[]>([]);
    const [allCompanys, setAllCompany] = useState<any[]>([]);
    const [filteredClasses, setFilteredClasses] = useState<any[]>([]);
    const isSynchronised = useIsSyncing();

    const [visible, setVisible] = useState(false);
    const handleClearClasse = () => {
        setSelectedPartner(null);
        setSearchQuery("");
        setFilteredClasses([])
    };
    useEffect(() => {
        setLoading(false)
    }, [navigation]);

    const form = useForm({
        defaultValues: { categorie: 1, type: undefined, text: "", partner: "", conpany: 1, },
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    const [selectedCat, setSelectedCat] = useState<any>(0);



    const getCategoryType = async () => {
        setType([]);
        try {
            setLoadingType(true);
            getTypesByCategory(form.getValues().categorie).then((types: any) => {
                setLoadingType(false);
                if (types.success) {
                    setType(types.data);
                    console.log(types.data);

                } else {
                    showCustomMessage("Information", types.message, "warning", "bottom")
                }
            }).catch((err) => {
                showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
                console.error('Une erreur s\'est produite :', err);
            });
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setLoadingType(false);
        }

    };
    const getCategory = async () => {
        setType([]);
        try {
            setLoadingCats(true);
            getdata('Categorys').then((types: any) => {
                setLoadingCats(false);
                if (types.success) {
                    setCats(types.data);
                } else {
                    showCustomMessage("Information", types.message, "warning", "bottom")
                }
            }).catch((err) => {
                showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
                console.error('Une erreur s\'est produite :', err);
            });
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setLoadingCats(false);
        }

    };
    const getpartners = async () => {
        setAllPartners([]);
        try {
            setIsLoadingPartner(true);
            getdata('Partner').then((types: any) => {
                setLoadingCats(false);
                if (types.success) {
                    setAllPartners(types.data);
                } else {
                    showCustomMessage("Information", types.message, "warning", "bottom")
                }
            }).catch((err) => {
                showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
                console.error('Une erreur s\'est produite :', err);
            });
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingPartner(false);
        }

    };
    const getcompany = async () => {
        setAllPartners([]);
        try {
            setIsLoadingCompany(true);
            getdata('Companys').then((types: any) => {
                setLoadingCats(false);

                if (types.success) {
                    setAllCompany(types.data);
                } else {
                    showCustomMessage("Information", types.message, "warning", "bottom")
                }
            }).catch((err) => {
                showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
                console.error('Une erreur s\'est produite :', err);
            });
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingCompany(false);
        }

    };
    const handleFilter = (query: string) => {
        setSearchQuery(query);
        if (query && query.length > 0) {
            const filtered = allPartners.filter((item) =>
                item.name.toLowerCase().includes(query.toLowerCase()));
            setFilteredClasses(filtered);
        } else {
            setFilteredClasses([]);
        }
    };

    useEffect(() => {
        getCategory();
        getpartners();
        getcompany();
    }, []);
    useEffect(() => {
        getCategoryType()
    }, [selectedCat]);


    return (
        <View style={styles.container}>
            <Header
                title={"Ajouter un Ticktet"}
                theme={theme}
                onLogoutPressed={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'AuthStacks' }],
                    })
                }}
                visible={visible}
                setVisible={setVisible}
                navigation={navigation} />
            <MyBanner refreshLocal={isSynchronised} theme={theme} />

            <ScrollView style={{ flex: 1, width: "100%" }}>
                <View style={styles.content}>
                    <Text style={styles.title}>{"Choisir la compagnie"}</Text>
                    <Controller
                        control={form.control}
                        name="conpany"
                        render={({ field, fieldState }) => (
                            <View style={{ flex: 1 }}>
                                <View style={styles.inputContainer}>
                                    {loadingCats &&
                                        <ActivityIndicator />
                                    }
                                    {!loadingCats &&
                                        <Icon name="format-list-bulleted" size={24} style={styles.icon} />
                                    }
                                    <Picker
                                        selectedValue={field.value}
                                        onValueChange={(itemValue, itemIndex) => {
                                            field.onChange(itemValue!)
                                            setSelectedCat(itemValue!)
                                            form.formState.isValid
                                        }}
                                        style={{ flex: 1, gap: 0, color: theme.primaryText, fontSize: 1, padding: 0 }}
                                        dropdownIconColor={theme.primary}
                                        mode="dropdown"
                                    >
                                        <Picker.Item style={{ fontSize: 16, ...Theme.fontStyle.montserrat.semiBold }} label={"Choisir une categorie"} value={null} />
                                        {allCompanys && allCompanys.map((relation: any) => {
                                            return <Picker.Item key={relation.id} style={{ fontSize: 16, ...Theme.fontStyle.montserrat.semiBold }} label={relation.name} value={relation.id} />
                                        })}
                                    </Picker >
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                            </View>)} />
                    <Text style={styles.title}>{"Categorie du ticket"}</Text>
                    <Controller
                        control={form.control}
                        name="categorie"
                        render={({ field, fieldState }) => (
                            <View style={{ flex: 1 }}>
                                <View style={styles.inputContainer}>
                                    {loadingCats &&
                                        <ActivityIndicator />
                                    }
                                    {!loadingCats &&
                                        <Icon name="format-list-bulleted" size={24} style={styles.icon} />
                                    }
                                    <Picker
                                        selectedValue={field.value}
                                        onValueChange={(itemValue, itemIndex) => {
                                            field.onChange(itemValue!)
                                            setSelectedCat(itemValue!)
                                            form.formState.isValid
                                        }}
                                        style={{ flex: 1, gap: 0, color: theme.primaryText, fontSize: 1, padding: 0 }}
                                        dropdownIconColor={theme.primary}
                                        mode="dropdown"
                                    >
                                        <Picker.Item style={{ fontSize: 16, ...Theme.fontStyle.montserrat.semiBold }} label={"Choisir une categorie"} value={null} />
                                        {cats && cats.map((relation: any) => {
                                            return <Picker.Item key={relation.id} style={{ fontSize: 16, ...Theme.fontStyle.montserrat.semiBold }} label={relation.name} value={relation.id} />
                                        })}
                                    </Picker >
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                            </View>)} />

                    <Text style={styles.title}>{"Type du ticket"}</Text>
                    <Controller
                        control={form.control}
                        name="type"
                        render={({ field, fieldState }) => (
                            <View style={{ flex: 1 }}>
                                <View style={styles.inputContainer}>
                                    {loadingType &&
                                        <ActivityIndicator />
                                    }
                                    {!loadingType &&
                                        <Icon name="format-list-bulleted" size={24} style={styles.icon} />
                                    }
                                    <Picker
                                        selectedValue={field.value}
                                        onValueChange={(itemValue, itemIndex) => {
                                            field.onChange(itemValue!)
                                            form.formState.isValid
                                        }}
                                        style={{ flex: 1, gap: 0, color: theme.primaryText, fontSize: 1, padding: 0 }}
                                        dropdownIconColor={theme.primary}
                                        mode="dropdown"
                                    >
                                        <Picker.Item style={{ fontSize: 16, ...Theme.fontStyle.montserrat.semiBold }} label={"Choisir le type"} value={null} />
                                        {type && type.map((relation: any) => {
                                            return <Picker.Item key={relation.id} style={{ fontSize: 16, ...Theme.fontStyle.montserrat.semiBold }} label={relation.name} value={relation.id} />
                                        })}
                                    </Picker >
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                            </View>)} />

                    <Text style={styles.title}>{"Choisir le client concerné"}</Text>

                    <Controller
                        control={form.control}
                        name="partner"
                        render={({ field, fieldState }) => {

                            return <View >
                                <View style={styles.sexeContainer}>
                                    {!selectedPartner &&
                                        <>

                                            <Searchbar
                                                icon={() => isLoadingPartner ? <ActivityIndicator /> : <Icon name="search" size={30} color="gray" />}
                                                style={styles.search}
                                                placeholder="Search"
                                                onChangeText={handleFilter}
                                                value={searchQuery}
                                            />


                                            <FlatList
                                                data={filteredClasses}
                                                keyExtractor={(item: any, index) => index.toString()}
                                                scrollEnabled={false}
                                                nestedScrollEnabled={false}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        style={styles.item}
                                                        onPress={() => {
                                                            setSelectedPartner(item);
                                                            field.onChange(item.id)
                                                            setVisible(false);
                                                        }}>
                                                        <Text style={styles.title}>{item?.id} -- {item?.name}</Text>
                                                        {/* <Text style={styles.subtitle}>{item.age}</Text> */}
                                                    </TouchableOpacity>
                                                )}
                                            />
                                        </>
                                    }
                                    {selectedPartner &&
                                        <View style={styles.selectedClasses}>
                                            <MaterialCommunityIcons name="school" size={30} color="green" />
                                            <Text style={[styles.textField, { flex: 1, padding: 5 }]}>{selectedPartner.name}  </Text>
                                            <TouchableOpacity onPress={handleClearClasse}>
                                                <MaterialCommunityIcons name="close-box-multiple-outline" size={25} color={theme.gray4} />
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}

                            </View>
                        }} />

                    <Text style={styles.title}>{"Description du ticket"}</Text>
                    <Controller
                        control={form.control}
                        name="text"
                        render={({ field, fieldState }) => (
                            <View>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        textAlignVertical="top"
                                        placeholder="Texte du Ticket"
                                        style={[styles.input, { height: 200 }]}
                                        value={field.value}
                                        multiline={true}
                                        numberOfLines={5}
                                        onChange={() => (form.formState.isValid)}
                                        onChangeText={field.onChange}
                                        placeholderTextColor={theme.placeholderTextColor}
                                        keyboardType="default"
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}

                            </View>

                        )} />


                    <TouchableOpacity style={styles.button} onPress={() => {
                        if (!form.formState.isValid) {
                            console.log("----------------------", form.formState.isValid);
                            showCustomMessage("Information", I18n.t('Register.all_fields_required'), "warning", "bottom")
                            form.handleSubmit(handleSubmittedFormuler)();

                            return;
                        }
                        form.handleSubmit(handleSubmittedFormuler)();
                    }}>
                        <Text style={styles.buttonText}> {"Créer le Ticket"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <CustomerLoader loading={loading} theme={theme} I18n={I18n} color={theme.primary} />

        </View>
    )
}



export default AddTicketScreen