/**
 * @format
 */

import 'react-native-gesture-handler';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { appStore, persistor } from 'store';
import { useEffect } from 'react';
import { enableScreens } from 'react-native-screens'


const AppWrapper = () => {

    useEffect(() => {
        enableScreens();
    }, [])

    return (
        <Provider store={appStore}>
            <PersistGate loading={null} persistor={persistor}>
                <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                    <App />
                </SafeAreaProvider>
            </PersistGate>
        </Provider>
    );
}

AppRegistry.registerComponent(appName, () => AppWrapper);
