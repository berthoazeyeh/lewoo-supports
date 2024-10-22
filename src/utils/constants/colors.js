import { showMessage } from "react-native-flash-message"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const PRIMARY = 'green'
export const PRIMARY_LIGHT = '#FFDED0'
export const BLACK = '#000000'
export const languages = ["fr", "en"]


export const WHITE = "#ffffff"
export const DARK_MODE = "#0B141B"

const tintColorLight = PRIMARY;
const tintColorDark = DARK_MODE;

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#000',
    background: '#fff',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },

};

export const showCustomMessage = (title, message, type, position) => showMessage({
  message: title,
  description: message,
  icon: props => <MaterialCommunityIcons
    name={type === "success" ? "check-decagram-outline" : "information-outline"}
    size={20}
    color={"white"}
    {...props} />,
  type: type ?? "warning",
  position: position ?? "bottom",
  duration: 3000,
  textStyle: { fontSize: 17 }
});

