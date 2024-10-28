import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Modal, Image, TextInput, Alert, Switch, TouchableWithoutFeedback, Keyboard, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text, Button, Card, Title, Paragraph, FAB, Icon } from 'react-native-paper';
import SQLite from 'react-native-sqlite-storage';
import Tts from 'react-native-tts';
import KeepAwake from 'react-native-keep-awake';
import ListeningIndicator from 'components/Listining';
import MyBanner from 'components/MyBanner';
import { updateSynAttendencesUP, useIsSyncing, useSyncingAttendences, useTheme } from 'store';
import { createTableForAttendance, db, getUserByRfidCodes, handleAttendance, handleCreateAttendance, handleCreateAttendanceCorrect } from 'apis/databaseAttend';
import { oupss, Theme } from 'utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';

let typingTimeout = null;
let clearTimeoutRef = null;



const selectAllFromAfricasystem = () => {
    db.transaction(tx => {
        tx.executeSql(
            `SELECT * FROM attendance WHERE id_user = ? ORDER BY created_at DESC LIMIT 1;`,
            [30],
            (_, { rows }) => {

                console.log("rows........", rows.item(0));

            });
        tx.executeSql(
            `SELECT id, rfidcode, name FROM africasystem`,
            [],
            (tx, results) => {
                const rows = results.rows;
                let data = [];

                for (let i = 0; i < rows.length; i++) {
                    data.push(rows.item(i));
                }
                console.log('Retrieved data from africasystem:', data);
            },
            error => {
                // console.error('Error retrieving data from africasystem:', error);
            }
        );
    });
};








const AttendencesNFC = (props) => {
    const [nfcTag, setNfcTag] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [tmpVisible, setTmpVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('fr-FR');
    const [isTtsEnabled, setIsTtsEnabled] = useState(true);
    const [addUserModalVisible, setAddUserModalVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const isSynchronised = useSyncingAttendences();
    const theme = useTheme();
    const { navigation } = props
    const nfcInputRef = useRef(null);
    const dispatch = useDispatch()

    const createAllTable = async () => {
        await createTableForAttendance(db);
    }
    const handleNfcInput = (rfidcode) => {
        setNfcTag(rfidcode);
        onRfidScan(rfidcode)
    };


    const onRfidScan = async (rfidCode) => {
        try {
            const res = await getUserByRfidCodes(rfidCode);
            clearTimeoutRef = setTimeout(() => {
                setMessage(null)
                setNfcTag('');
                setSelectedUser(null);
                setModalVisible(false);
                if (nfcInputRef.current) {
                    nfcInputRef.current.focus();
                }
            }, 3000);
            if (res.success) {
                if (typingTimeout) {
                    clearTimeout(typingTimeout);
                }
                setTmpVisible(false)
                setSelectedUser(res.data);
                const res1 = await handleCreateAttendanceCorrect(res.data?.id, res.data?.name);
                console.log("res1[[[[", res1);

                if (res1.success) {
                    setMessage(res1.message)
                    if (isTtsEnabled) {
                        Tts.setDefaultLanguage(selectedLanguage).then(() => {
                            Tts.speak(res1.message);
                        });
                    }
                    if (clearTimeoutRef) {
                        clearTimeout(clearTimeoutRef);
                    }
                    dispatch(updateSynAttendencesUP(false))
                    setTimeout(() => {
                        dispatch(updateSynAttendencesUP(true))
                    }, 1000);
                }
                selectAllFromAfricasystem()
                setModalVisible(true);
            } else {
                setTmpVisible(false)
                setAddUserModalVisible(true)
                clearTimeoutRef = setTimeout(() => {
                    setAddUserModalVisible(false);
                    if (nfcInputRef.current) {
                        nfcInputRef.current.focus();
                    }
                }, 3000);
            }

        } catch (error) {
            console.log('Utilisateur non trouvé :', error);
        }
    };
    useEffect(() => {
        if (nfcInputRef.current) {
            nfcInputRef.current.focus();
        }
        KeepAwake.activate();
        selectAllFromAfricasystem()

    }, []);

    useEffect(() => {
        createAllTable()

    }, []);

    return (
        <View style={{ flex: 1 }}>

            <MyBanner refreshLocal={isSynchronised} theme={theme} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedUser ? (
                            <>
                                {message && <Text style={styles.userName}>{message}</Text>}
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${selectedUser.image}` }}
                                    style={styles.userImage}
                                />
                                <Text style={styles.userName}>{selectedUser.name}</Text>
                                <Button onPress={() => setModalVisible(false)}>Close</Button>
                            </>
                        ) : (
                            <Text>No user found</Text>
                        )}
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={tmpVisible}
                onRequestClose={() => setTmpVisible(false)}
                onTouchCancel={() => setTmpVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={{
                        width: "80%", padding: 20,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        alignItems: 'center',
                    }}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="User RFID Code"
                                value={nfcTag}
                                onChangeText={(code) => {
                                    setNfcTag(code);
                                }}
                            />
                        </View>

                        <Button
                            icon={!loading ? "account-arrow-right" : undefined}
                            mode="contained"
                            onPress={() => onRfidScan(nfcTag)}
                        >
                            {loading ? <ActivityIndicator color={theme.secondaryText} /> : ' check.'}
                        </Button>
                    </View>
                </View>
            </Modal>


            <Modal
                animationType="slide"
                transparent={true}
                visible={addUserModalVisible}
                onRequestClose={() => setAddUserModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => setAddUserModalVisible(false)} style={{ position: "absolute", right: 10, top: 7 }}>
                            <MaterialCommunityIcons name="close" size={25} color={theme.primaryText} />
                        </TouchableOpacity>
                        <Image
                            source={oupss}
                            style={styles.image}
                        />
                        <Text style={styles.labels}>Nous avons du mal à vous reconnaître, veuillez réessayer s'il vous plaît.</Text>
                        <Text style={styles.labels}>{nfcTag}</Text>

                    </View>
                </View>
            </Modal>


            {/* <TouchableWithoutFeedback onPress={() => nfcInputRef.current && nfcInputRef.current.focus()}> */}
                <SafeAreaView style={styles.container}>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Card style={styles.card}>
                            <Card.Content>
                                <Title style={styles.title}> Africasystems NFC Reader</Title>
                            </Card.Content>
                        </Card>
                        <View style={{ marginVertical: 60, height: 200 }}>
                            <ListeningIndicator />
                        </View>
                        <Card style={styles.card}>
                            <Card.Content>
                                <Paragraph style={{ textAlign: "center" }}>Scan your NFC card using the connected external reader.</Paragraph>
                            </Card.Content>
                        </Card>
                        {/* Language Selection */}
                        <View style={styles.languageSelector}>
                            <Text style={styles.label}>Select AI Language:</Text>
                            <Picker
                                selectedValue={selectedLanguage}
                                style={styles.picker}
                                onValueChange={(itemValue) => setSelectedLanguage(itemValue)} >
                                <Picker.Item label="French (fr-FR)" value="fr-FR" />
                                <Picker.Item label="English (en-US)" value="en-US" />
                            </Picker>
                        </View>

                        {/* TTS Toggle */}
                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>Enable AI Speech:</Text>
                            <Switch
                                onValueChange={(value) => setIsTtsEnabled(value)}
                                value={isTtsEnabled}
                            />
                        </View>

                        <TextInput
                            ref={nfcInputRef}
                            style={styles.hiddenInput}
                            value={nfcTag}
                            onChangeText={handleNfcInput}
                            autoFocus={true}
                        />
                        {nfcTag && (
                            <Card style={styles.tagCard}>
                                <Card.Content>
                                    <Title>Scanned NFC Tag</Title>
                                    <Paragraph>{nfcTag}</Paragraph>
                                </Card.Content>
                            </Card>
                        )}
                        <Button icon="account-arrow-right" mode="contained" onPress={() => navigation.reset({
                            index: 0,
                            routes: [{ name: 'ApplicationStacks' }],
                        })}>
                            Vous êtes membre du support ? Continuez.
                        </Button>
                    </ScrollView>
                    <FAB
                        icon="plus"
                        style={styles.fab}
                        color={theme.secondaryText}
                        onPress={() => {

                            setTmpVisible(true)


                        }}
                    />
                </SafeAreaView>
            {/* </TouchableWithoutFeedback> */}

        </View>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        elevation: 0,
        marginBottom: 20,
        width: '100%',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    tagCard: {
        marginTop: 20,
        width: '100%',
        backgroundColor: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        padding: 20,
        width: "95%",
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userDescription: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    userImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginVertical: 20,
        borderWidth: 2,
        borderColor: '#ccc',
        marginBottom: 10,
        resizeMode: "stretch"

    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 10,
        marginBottom: 20,
        resizeMode: "stretch"

    },
    hiddenInput: {
        height: 0,
        width: 0,
        opacity: 0,
    },
    languageSelector: {
        marginBottom: 20,
        width: '100%',
    },
    picker: {
        height: 50,
        color: 'black',
        width: '100%',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginRight: 10,
    },
    labels: {
        textAlign: "center",
        fontSize: 15,
        ...Theme.fontStyle.montserrat.semiBold
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15, // Added space between input fields
        width: '100%',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        color: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        width: '100%',
    },
});

export default AttendencesNFC;
