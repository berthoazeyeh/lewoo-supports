import Spinner from "react-native-loading-spinner-overlay";

const CustomerLoader = ({ loading, theme, I18n, color }: any) => {
    return <Spinner
        visible={loading}
        size={40}
        color={color}
        textStyle={{ color: theme.primary, textAlign: "center" }}
        textContent={`${I18n.t("please_wait")}`}
        cancelable={true}

    />
}

export default CustomerLoader