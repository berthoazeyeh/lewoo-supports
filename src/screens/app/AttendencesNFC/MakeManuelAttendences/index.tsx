import { View } from "react-native";
import { clearUserStored, useCurrentUser, useSyncingAttendences, useTheme } from "store";
import dynamicStyles from "./style";
import { useFocusEffect } from "@react-navigation/native";
import MyBanner from "components/MyBanner";
import UserItem, { Attendance } from "./components/UserItem";
import { Text } from "react-native";
import { FlatList } from "react-native";
import { Searchbar } from "react-native-paper";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { getFilterAttendances } from "apis/databaseAttend";
import { useDispatch } from "react-redux";



const MakeManuelAttendences = (props: any) => {
    const { navigation } = props;
    const theme = useTheme()
    const styles = dynamicStyles(theme)
    const isSynchronised = useSyncingAttendences();
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsloading] = useState(false)
    const [allEmployee, setAllEmployee] = useState<Attendance[]>([])
    const [filteredData, setFilteredData] = useState<Attendance[]>([])
    const dispatch = useDispatch()
    const user = useCurrentUser();
    // console.log("=============", user);

    const getLocalData = async () => {

        const data: any = await getFilterAttendances();
        // console.log("=============", data.data[0]);
        if (data.success) {
            setAllEmployee((data.data));
        }
    }
    useEffect(() => {
        onChangeSearch(searchQuery);
    }, [allEmployee]);
    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: 'Management des presences',
        });
    }, []);
    useFocusEffect(
        useCallback(() => {
            console.log("syn----------------------------------------");
            if (!user) {
                navigation.goBack();
            }
            getLocalData();
            return () => {
                // dispatch(clearUserStored(null));
            };
        }, [isSynchronised, isLoading])
    );
    const onChangeSearch = (query: string) => {
        console.log(query);
        setSearchQuery(query);
        const filtered = allEmployee.filter(item => {
            const queryWords = query.trim().toLowerCase().split(' ');  // Divise la query en mots
            return queryWords.every(word =>
                item.user_name.toLowerCase().includes(word)  // Vérifie chaque mot dans le user_name
            );
        });
        setFilteredData(filtered);
    };
    const renderUser = ({ item }: any) => <UserItem
        attendance={item}
        navigation={navigation}
        reSync={isLoading}
        updateSync={setIsloading}

    />;


    return (
        <View style={styles.container}>
            <MyBanner refreshLocal={isSynchronised} theme={theme} />

            <Searchbar
                placeholder="Rechercher un employé (nom, prenom...)"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={{
                    height: 50,
                    borderRadius: 15,
                    marginBottom: 15,
                    backgroundColor: '#f0f0f0',
                }}
            />
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Liste des utilisateurs</Text>
            <FlatList
                data={filteredData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderUser}
            />
        </View>
    )
}


export default MakeManuelAttendences




