import { ActivityIndicator, Text, View } from "react-native";
import { Banner } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCurrentBannerMessage } from "store";

interface MyBannerProps {
    refreshLocal: boolean,
    theme: any
}
const MyBanner = ({ refreshLocal, theme }: MyBannerProps) => {
    return <Banner
        visible={refreshLocal}
        style={{ width: "100%", }}
    >
        <View style={{ flexDirection: 'row', alignItems: "center", gap: 10, flex: 1, flexWrap: "wrap" }}>
            <ActivityIndicator color="green" size={30} />
            <Text style={{ flex: 1, width: "80%", overflow: "hidden" }}>
                {useCurrentBannerMessage()}
            </Text>
        </View>
    </Banner>
}

export default MyBanner