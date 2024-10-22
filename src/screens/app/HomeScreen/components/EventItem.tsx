import { Image, Text, TouchableOpacity, View } from "react-native"
import dynamicStyles from "../style";
import { useTheme } from "store";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

const EventItem = ({ item, I18n, navigation }: any): React.JSX.Element => {
    const theme = useTheme()
    const styles = dynamicStyles(theme)
    const startDate = moment(item?.date_created);
    const endDate = moment(item?.date_end);
    // console.log(item?.date_end);

    const StarRating = ({ priority }: any) => {
        const totalStars = 5; // Toujours afficher 5 étoiles
        const stars = [];

        // Boucle pour ajouter les étoiles colorées, demi-colorées ou grises en fonction de la priorité
        for (let i = 0; i < totalStars; i++) {
            if (i < Math.floor(priority)) {
                // Étoile pleine pour les valeurs entières
                stars.push(
                    <MaterialCommunityIcons
                        key={i}
                        name="star"
                        size={24}
                        color="red" // Couleur pour les étoiles pleines
                    />
                );
            } else if (i < priority && priority % 1 !== 0) {
                // Demi-étoile pour les valeurs décimales
                stars.push(
                    <MaterialCommunityIcons
                        key={i}
                        name="star-half-full"
                        size={24}
                        color="red" // Couleur pour les demi-étoiles
                    />
                );
            } else {
                // Étoile grise pour les valeurs restantes
                stars.push(
                    <MaterialCommunityIcons
                        key={i}
                        name="star"
                        size={24}
                        color="gray" // Couleur pour les étoiles restantes
                    />
                );
            }
        }

        return <View style={{ flexDirection: 'row' }}>{stars}</View>;
    };

    return <View style={styles.itemContainer}>
        <TouchableOpacity style={{ flexDirection: "row", }}
            onPress={() => {
                navigation.navigate("EventDetailsScreen", { event: item })
                // EventDetailsScreen
            }}
        >
            <View style={{ backgroundColor: theme.primary, width: "30%", justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.title}>{startDate.format("DD")}</Text>
                <Text style={styles.subTitle}>{startDate.format("MMM YYYY")}</Text>
                <Text style={styles.subTitle}>{startDate.format("HH[h]mm")}</Text>
                <View style={{ flexDirection: "row", gap: 5, marginVertical: 10, alignItems: "center" }}>
                    <MaterialCommunityIcons name="arrow-right-thin" size={30} color={theme.secondaryText} />
                    <Text style={styles.subTitle}>{endDate.format("DD MMM")}</Text>
                </View>
            </View>
            <View style={{ width: "70%", padding: 5, justifyContent: "space-between" }}>
                <Text style={styles.title1} numberOfLines={1} > {item.name}</Text>
                <View style={styles.eventDatecontainer}>
                    <View style={styles.eventDateContent}>
                        <Text style={styles.titleHeader}>{"Categorie"}</Text>
                        <Text style={styles.titles}>{item?.category_name}</Text>
                    </View>
                    <View style={styles.eventDateContent}>
                        <Text style={styles.titleHeader}>{"Type"}</Text>
                        <Text style={[styles.titles, { textAlign: "center" }]}>{item?.type_name}</Text>
                    </View>
                </View>

                <Text style={styles.stage}>{' '}
                    <MaterialCommunityIcons name="progress-clock" size={25} color={theme.primaryText} />  {item?.stage_id?.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 5 }}>
                    {/* <Text style={styles.stage}>
                        {item?.stage}
                    </Text> */}
                    <StarRating priority={parseInt(item?.priority)} />

                    <MaterialCommunityIcons name="arrow-right-bold-circle" size={25} color={theme.primary} />
                </View>
            </View>
        </TouchableOpacity>

    </View >
}

export default EventItem;