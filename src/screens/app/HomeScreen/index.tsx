import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { clearUserStored, useCurrentSynchronisedStateDown, useCurrentSynchronisedStateUp, useCurrentUser, useIsSyncing, useTheme } from "store";
import { useDispatch } from "react-redux";
import { useColorScheme } from "react-native";
import { Header } from "./components";
import { FAB } from "react-native-paper";
import dynamicStyles from "./style";
import useSWR from "swr";
import { getdata, getData, getPartnerRequest, getResquestData, LOCAL_URL, postData } from "apis";
import useSWRMutation from "swr/mutation";
import { FlatList } from "react-native";
import { RefreshControl } from "react-native";
import EventItem from "./components/EventItem";
import { I18n } from 'i18n';
import MyBanner from "components/MyBanner";

const HomeScreen = (props: any): React.JSX.Element => {
    const theme = useTheme()
    const { navigation } = props
    const dispatch = useDispatch()
    const user = useCurrentUser();
    const styles = dynamicStyles(theme);
    // const isSynchronised = useCurrentSynchronisedStateDown();
    const isSynchronised = useIsSyncing();
    const [visible, setVisible] = useState(false);
    const [refresh, setRefresh] = useState(false)
    const [request, setRequest] = useState<any[]>([])
    const SynchronisedStateDown = useCurrentSynchronisedStateDown();
    const SynchronisedStateUp = useCurrentSynchronisedStateUp();
    useEffect(() => {
    }, [navigation]);
    const scheme = useColorScheme();
    // const { data, error: typeError, isLoading: isLoadingType } = useSWR(`${LOCAL_URL}/api/support/requests/${user?.partner_id}`,
    //     getData,
    //     {
    //         refreshInterval: 10000,
    //         refreshWhenHidden: true,
    //     },
    // );

    const getLocalData = async () => {
        if (user) {
            const data: any = await getPartnerRequest(user?.partner_id);
            // console.log(data);

            if (data.success) {
                setRequest((data.data).slice(0, 25));
            }
        }
    }
    useEffect(() => {
        getLocalData()
        if (!user) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'AuthStacks' }],
            })
        }
    }, [SynchronisedStateDown, SynchronisedStateUp]);

    const renderEmptyStudentElement = () => (
        <View style={styles.emptyData}>
            <Text style={styles.emptyDataText}>{"Aucun Ticket trouvé"}</Text>
        </View>
    );
    return (
        <View style={styles.container}>

            <Header
                title={"Mes Ticket"}
                theme={theme}
                onLogoutPressed={() => {
                    dispatch(clearUserStored(null));
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'AuthStacks' }],
                    })

                }}
                visible={visible}
                setVisible={setVisible}
                navigation={navigation} />
            <MyBanner refreshLocal={isSynchronised} theme={theme} />
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            setRefresh(!refresh)
                        }}
                    />}
                data={request}
                renderItem={({ item }) => <EventItem item={item} I18n={I18n} navigation={navigation} />}
                keyExtractor={item => item.id}
                ListEmptyComponent={renderEmptyStudentElement}
            />

            <FAB
                icon="plus"
                style={styles.fab}
                color={theme.secondaryText}
                onPress={() => navigation.navigate('AddTicketScreen')}
            />

        </View>
    )
}



export default HomeScreen