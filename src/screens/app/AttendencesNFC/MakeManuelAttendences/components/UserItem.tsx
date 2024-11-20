import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Linking } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-paper';
import { updateStoredtPosition, updateSynAttendencesUP, useCurrentUser, userCurrentPosition, useTheme } from 'store';
import { showCustomMessage, Theme } from 'utils';
import { getCurrentLocation, getFilterAttendancesOneUser, handleCreateAttendanceCorrect } from 'apis/databaseAttend';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';

export type Attendance = {
    checkin_time: string | null;
    checkout_time: string | null;
    created_at: string | null;
    id: number | null;
    id_user: number | null;
    isLocal: number | null;
    is_checkin: number | null;
    updated_at: string | null;
    user_id: number;
    user_name: string;
    rfidcode: string;
};

interface UserItemProps {
    attendance: Attendance;
    navigation: any;
    reSync: boolean;
    updateSync: (boolean: boolean) => void;
}

const UserItem: React.FC<UserItemProps> = ({ attendance: attend, navigation, reSync, updateSync }) => {
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
    const [isLoading, setIsloading] = useState(false)
    const [attendance, setAttendance] = useState<Attendance>(attend)
    const user = useCurrentUser();
    const position = userCurrentPosition()
    const theme: any = useTheme();
    const styles = getStyles(theme);
    const dispatch = useDispatch()

    const getLocalData = async () => {
        const data: any = await getFilterAttendancesOneUser(attendance.id_user!);
        if (data.success && (data.data).length > 0) {
            setAttendance((data.data)[0]);
        }
    }
    const openAppSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:')
        } else {
            Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
        }
    }

    const handleDateTimeSelection = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (event: any, date: Date | undefined) => {
        setShowDatePicker(false);
        if (date) {
            setSelectedDateTime(date);
            setShowTimePicker(true);
        }
    };

    const handleTimeChange = (event: any, time: Date | undefined) => {
        setShowTimePicker(false);
        if (time) {
            const combinedDateTime = new Date(selectedDateTime || new Date());
            combinedDateTime.setHours(time.getHours());
            combinedDateTime.setMinutes(time.getMinutes());
            setSelectedDateTime(combinedDateTime);
        }
    };
    const handlePress = async () => {
        try {
            setIsloading(true)
            if (position) {
                const date = selectedDateTime ? selectedDateTime.toISOString() : null
                const res: any = await handleCreateAttendanceCorrect(attendance?.user_id, attendance.user_name, attendance?.rfidcode, user.id, 0, position, date);
                if (res.success) {
                    setIsloading(false);
                    getLocalData();
                    updateSync(!reSync);
                } else {
                    showCustomMessage("Avertissement", res?.message, "warning", 'bottom')
                }
            } else {
                showCustomMessage("Avertissement", "Veuillez activer la localisation pour effectuer cette action", "warning", 'bottom')
                const location = await getCurrentLocation();
                if (location.success) {
                    dispatch(updateStoredtPosition({ latitude: location.latitude, longitude: location.longitude }))
                    handlePress();
                } else {
                    openAppSettings();
                    console.log(location);
                }
            }
        } catch (error: any) {
            showCustomMessage("Avertissement", error?.message, "warning", 'bottom')
        } finally {
            setSelectedDateTime(null)
            setIsloading(false)
            dispatch(updateSynAttendencesUP(false))
            setTimeout(() => {
                dispatch(updateSynAttendencesUP(true))
            }, 1000);
        }
    }
    return (
        <View style={styles.itemContainer}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{attendance.user_name}</Text>
                {!selectedDateTime && (
                    <TouchableOpacity style={styles.statusButton}
                        onPress={handlePress}
                    >
                        {isLoading && <ActivityIndicator color={theme.secondaryText} />}
                        {!isLoading && <MaterialCommunityIcons
                            name={(attendance.checkin_time && !attendance.checkout_time) ? 'logout' : 'login'}
                            size={14}
                            color={theme.secondaryText}
                        />}
                        <Text style={styles.statusButtonText}>
                            {(attendance.checkin_time && !attendance.checkout_time) ? 'checkout' : ' checkin '}
                        </Text>
                    </TouchableOpacity>
                )}
                {selectedDateTime && (
                    <TouchableOpacity
                        onPress={() => setSelectedDateTime(null)}
                        style={styles.clearButton}>
                        <MaterialCommunityIcons name="close" size={14} color={theme.secondaryText} />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.activityText}>
                    {(attendance.checkin_time && !attendance.checkout_time)
                        ? "Dernière activité: "
                        : (attendance.checkin_time && attendance.checkout_time)
                            ? 'Dernière activité: '
                            : "Pas d'activité pour cet employé"}
                    {(attendance.checkin_time || attendance.checkout_time) &&
                        <Text style={styles.lastBadgeDate}>{(attendance.checkin_time && !attendance.checkout_time)
                            ? "Entrée" : "Sortie"}</Text>
                    }
                </Text>
                <TouchableOpacity
                    onPress={handleDateTimeSelection}
                    style={styles.chooseDateButton}>
                    <MaterialCommunityIcons name='calendar' size={14} color={theme.primaryText} />
                    <Text style={styles.chooseDateButtonText}>{'Choisir'}</Text>
                </TouchableOpacity>
            </View>
            {selectedDateTime && (
                <View style={styles.selectedDateTimeContainer}>
                    <Text style={styles.selectedDateTimeText}>
                        {`Sélectionné: ${selectedDateTime.toLocaleDateString()} ${selectedDateTime.toLocaleTimeString()}`}
                    </Text>
                    <MaterialCommunityIcons
                        name={attendance.checkout_time ? "arrow-down-thin" : "arrow-up-thin"}
                        size={17}
                        color={attendance.checkout_time ? "red" : theme.primary}
                    />
                </View>
            )}
            {selectedDateTime && (
                <TouchableOpacity style={styles.confirmButton}
                    onPress={handlePress}
                >
                    {isLoading && <ActivityIndicator color={theme.secondaryText} />}
                    {!isLoading && <MaterialCommunityIcons name='calendar-check-outline' size={14} color={theme.secondaryText} />}
                    <Text style={styles.confirmButtonText}>{'Confirmer'}</Text>
                </TouchableOpacity>
            )}
            {!selectedDateTime && (
                <Text style={styles.lastBadgeText}>
                    Dernière action :{' '}
                    <Text style={styles.lastBadgeDate}>
                        {attendance.checkout_time
                            ? `${new Date(attendance.checkout_time).toLocaleDateString()} ${new Date(attendance.checkout_time).toLocaleTimeString()}`
                            : attendance.checkin_time
                                ? `${new Date(attendance.checkin_time).toLocaleDateString()} ${new Date(attendance.checkin_time).toLocaleTimeString()}`
                                : "Aucune donnée"}
                    </Text>
                    {(attendance.checkout_time || attendance.checkin_time) && (
                        <MaterialCommunityIcons
                            name={attendance.checkout_time ? "arrow-down-thin" : "arrow-up-thin"}
                            size={17}
                            color={attendance.checkout_time ? "red" : theme.primary}
                        />
                    )}
                </Text>
            )}
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDateTime || new Date()}
                    mode="date"
                    minimumDate={attendance.checkout_time ? new Date(attendance.checkout_time) : attendance.checkin_time ? new Date(attendance.checkin_time) : undefined}
                    maximumDate={new Date()}
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            {showTimePicker && (
                <DateTimePicker
                    value={selectedDateTime || new Date()}
                    mode="time"
                    display="spinner"
                    onChange={handleTimeChange}
                />
            )}
        </View>
    );
};

const getStyles = (theme: any) =>
    StyleSheet.create({
        itemContainer: {
            padding: 10,
            backgroundColor: '#fff',
            marginVertical: 15,
            marginHorizontal: 2,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            elevation: 3,
        },
        userInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        userName: {
            ...Theme.fontStyle.montserrat.bold,
            fontSize: 18,
            color: theme.primaryText,
            flex: 1,
        },
        statusButton: {
            flexDirection: 'row',
            backgroundColor: theme.primary,
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 15,
            alignItems: 'center',
            height: 25,
        },
        statusButtonText: {
            ...Theme.fontStyle.montserrat.regular,
            fontSize: 14,
            color: theme.secondaryText,
        },
        clearButton: {
            flexDirection: 'row',
            backgroundColor: 'red',
            paddingHorizontal: 5,
            paddingVertical: 3,
            borderRadius: 25,
            alignItems: 'center',
            height: 25,
        },
        infoRow: {
            flexDirection: 'row',
            marginVertical: 15,
            alignItems: 'center',
        },
        activityText: {
            ...Theme.fontStyle.montserrat.regular,
            fontSize: 14,
            color: theme.primaryText,
            flex: 1,
        },
        chooseDateButton: {
            flexDirection: 'row',
            backgroundColor: theme.gray,
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 15,
            alignItems: 'center',
            height: 25,
        },
        chooseDateButtonText: {
            ...Theme.fontStyle.montserrat.regular,
            fontSize: 14,
            color: theme.primaryText,
        },
        selectedDateTimeContainer: {
            flexDirection: 'row',
            alignSelf: 'center',
            marginVertical: 10,
        },
        selectedDateTimeText: {
            color: 'blue',
            fontSize: 16,
        },
        confirmButton: {
            flexDirection: 'row',
            backgroundColor: theme.primary,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 15,
            alignItems: 'center',
            alignSelf: 'center',
            marginVertical: 10,
        },
        confirmButtonText: {
            ...Theme.fontStyle.montserrat.regular,
            fontSize: 14,
            color: theme.secondaryText,
        },
        lastBadgeText: {
            ...Theme.fontStyle.montserrat.regular,
            color: theme.primaryText,
            marginTop: 5,
            textAlign: 'center',
            fontSize: 12,
        },
        lastBadgeDate: {
            ...Theme.fontStyle.montserrat.semiBold,
        },
    });

export default UserItem;
