import { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { clearUserStored, selectLanguageValue, useCurrentSynchronisedStateDown, useCurrentUser, useIsSyncing, useTheme } from "store";
import dynamicStyles from "./style";
import { ActivityIndicator, Banner, FAB } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getData, LOCAL_URL } from "apis/api";
import useSWRMutation from "swr/mutation";
import { getEventRegistrationData, getEventTiketData, insertEventRegistration, insertTicket } from "apis/database";
import { Headers } from "./components";
import moment from "moment";
import 'moment/locale/fr';
import { useFocusEffect } from "@react-navigation/native";
import MyBanner from "components/MyBanner";




function EventDetailsScreen(props: any): React.JSX.Element {
    const { navigation, route } = props;
    const { event } = route.params;
    const language = useSelector(selectLanguageValue);
    const { width } = Dimensions.get('window');
    const theme = useTheme()
    const user = useCurrentUser();
    const dispatch = useDispatch()
    const styles = dynamicStyles(theme)
    const [visible, setVisible] = useState(false);
    const [refreshLocal, setRefreshLocal] = useState(false);
    const startDate = moment(event?.date_created);
    const isSynchronised = useIsSyncing();
    const endDate = moment(event?.date_end);
    const [events, setEvents] = useState<any[]>([])
    const [tickets, setTickets] = useState<any[]>([])
    console.log(event?.user_id);
    const assigndUser = event?.user_id;
    // console.log(data);


    const { trigger: getAllEventsReg } = useSWRMutation(`${LOCAL_URL}/api/event/registrations/${event.id}`, getData);
    const { trigger: getAllTickets } = useSWRMutation(`${LOCAL_URL}/api/event.event.ticket/search`, getData);

    useEffect(() => {
        moment.locale(language);
        getOnlineData()
        setTimeout(() => {
        }, 3000)
        getLocalData()
        getLocalDataTikect()
    }, [navigation,])


    useFocusEffect(
        useCallback(() => {
            getOnlineData()
            return () => {
                // Code à exécuter quand l'écran perd le focus (facultatif)
                console.log("L'écran a perdu le focus");
            };
        }, [])
    );

    useEffect(() => {
        getOnlineData()
    }, [navigation])


    useEffect(() => {
        getLocalData()
        getLocalDataTikect()
    }, [refreshLocal, navigation])





    const getOnlineData = async () => {
        const eventsRes = await getAllEventsReg();
        const events: any[] = eventsRes?.success ? eventsRes.data : [];

        insertEventRegistration(events).then((data: any) => {
            console.log(data);
            setRefreshLocal(!refreshLocal);
        }).catch((error) => {
            console.log(error);
        })
        const tickterRes = await getAllTickets();
        const tickters: any[] = tickterRes?.success ? tickterRes.data : [];
        insertTicket(tickters).then((data: any) => {
            console.log(data);
            setRefreshLocal(!refreshLocal);
        }).catch((error) => {
            console.log(error);
        })

    }

    const getLocalData = async () => {
        if (event.id) {
            const data: any = await getEventRegistrationData(event.id);
            if (data.success) {

                setEvents(data.data);
            }
        }
    }
    const getLocalDataTikect = async () => {
        if (event.id) {
            const data: any = await getEventTiketData(event.id);

            if (data.success) {
                setTickets(data.data);
            }
            else {
                console.log("getEventTiketData[[[[", data);
            }
        }
    }



    const renderHeader = () => (
        <Banner
            visible={refreshLocal}
        >
            <View style={{ flexDirection: 'row', alignItems: "center", gap: 10 }}>
                <MaterialCommunityIcons name='sync' size={25} color={theme.primary}
                />
                <Text>
                    Synchrinisation en cours.
                </Text>
                <ActivityIndicator color="green" size={10} />
            </View>
        </Banner>
    );


    const renderItem = ({ item }: any) => (
        <View style={styles.itemContainer}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: item.state === "done" ? "green" : theme.primary }}>
                </View>
            </View>
            <Text style={styles.email}  >{item.email}, {item.phone}</Text>
        </View>
    );

    return <View style={styles.container}>
        <Headers title={"Detail du ticket"} onLogoutPressed={() => {
            dispatch(clearUserStored(null))
            navigation.reset({
                index: 0,
                routes: [{ name: 'AuthStacks' }],
            })
        }} theme={theme} navigation={navigation} />
        <MyBanner refreshLocal={isSynchronised} theme={theme} />

        {renderHeader()}
        <ScrollView>
            <View style={styles.content}>
                <View style={styles.eventNameContent}>
                    <Text style={styles.eventName}>{event.name}</Text>
                </View>
                <View style={styles.eventDatecontainer}>
                    <View style={styles.eventDateContent}>
                        <Text style={styles.titleHeader}>{"Date"}</Text>
                        <Text style={styles.title}>{startDate.format("dddd DD.")}</Text>
                        <Text style={styles.subTitle}>{startDate.format("MMMM YYYY")}</Text>
                        <Text style={styles.subTitle}>{startDate.format("HH[h]mm")}</Text>
                    </View>
                    <View style={styles.eventDateContent}>
                        <Text style={styles.titleHeader}>{"Status"}</Text>
                        <Text style={styles.subTitle}>{' '}</Text>
                        <Text style={styles.title}>{event?.stage_id?.name}</Text>
                        <Text style={styles.subTitle}>{' '}</Text>

                    </View>

                </View>
                <View style={styles.eventDescriptioncontainer}>
                    <Text style={styles.titleHeader}>{"Description"}</Text>
                    <Text style={styles.description}>{event?.request_text?.replace(/<\/?[^>]+(>|$)/g, "")}</Text>

                </View>
                <View style={styles.eventDatecontainer}>
                    <View style={styles.eventDateContent}>
                        <Text style={styles.titleHeader}>{"Categorie"}</Text>
                        <Text style={styles.title}>{event?.category_id?.name}</Text>
                    </View>
                    <View style={styles.eventDateContent}>
                        <Text style={styles.titleHeader}>{"Type"}</Text>
                        <Text style={styles.title}>{event?.type_id?.name}</Text>
                    </View>
                </View>
                {user && user?.id &&
                    <View style={styles.eventMenbercontainer}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>
                            <Text style={styles.titleHeader}>{"Ticket assigné a:"}</Text>

                        </View>
                        <View>
                            {assigndUser &&
                                <TouchableOpacity style={styles.itemContainer}>
                                    <View style={{ borderRadius: 10, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 10, }}>
                                        <MaterialCommunityIcons name='account' size={45} color={theme.gray4}
                                        />
                                        <Text style={styles.name}>{assigndUser.name}</Text>
                                    </View>
                                </TouchableOpacity>}

                            {!assigndUser &&
                                <Text
                                    style={{ textAlign: "center", paddingVertical: 20, fontSize: 18, color: theme.primaryText }}
                                >
                                    Aucune personne assignée a ce ticket
                                </Text>
                            }

                        </View>

                    </View>
                }

            </View>

        </ScrollView>


        {!user?.id && !visible &&
            <FAB
                style={styles.fab}
                label="Voir mon Invitation"
                color={theme.secondaryText}
                onPress={() => {
                    if (user) {
                        navigation.navigate("ViewTicketScreen", { event })
                    } else {

                        navigation.navigate("ViewInvitationScreen", { event })
                    }

                }} />
        }
        {!user?.id && !visible &&
            <FAB
                style={styles.fab1}
                label="Rejoindre "
                color={theme.secondaryText}
                onPress={() => setVisible(true)} />}


    </View >
}

export default EventDetailsScreen