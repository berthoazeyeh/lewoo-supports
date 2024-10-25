import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Modal, Image, TextInput, Alert, Switch, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import SQLite from 'react-native-sqlite-storage';
import Tts from 'react-native-tts';
import KeepAwake from 'react-native-keep-awake';
import imageMapping from './data';
import ListeningIndicator from 'components/Listining';
import MyBanner from 'components/MyBanner';
import { useIsSyncing, useTheme } from 'store';

let typingTimeout = null;
let clearTimeoutRef = null;

const deletes = () => {
    db.transaction(tx => {
        tx.executeSql(
            `DELETE FROM attendance where id>?`,
            [0],
            (tx, results) => {
                const rows = results.rows;
                let data = [];

                for (let i = 0; i < rows.length; i++) {
                    data.push(rows.item(i));
                }
                console.log('Retrieved data from africasystem:', data);
            },
            error => {
                console.error('Error retrieving data from africasystem:', error);
            }
        );
    });
};

const update = () => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE africasystem SET description=? where rfidcode=?`,
            ['Technicien', '2574247916'],
            (tx, results) => {
                const rows = results.rows;
                let data = [];

                for (let i = 0; i < rows.length; i++) {
                    data.push(rows.item(i));
                }


                console.log('Retrieved data from africasystem:', data);
            },
            error => {
                console.error('Error retrieving data from africasystem:', error);
            }
        );
    });
};

const selectAllFromAfricasystem = () => {
    db.transaction(tx => {
        tx.executeSql(
            `SELECT * FROM africasystem`,
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
                console.error('Error retrieving data from africasystem:', error);
            }
        );
    });
};

const getFormattedTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes() - 1;

    return `${hours} heure ${minutes} minute`;
};


const insertIntoAfricasystem = (name, rfidcode, image, description) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO africasystem (name, rfidcode, image, description) VALUES (?, ?, ?, ?)`,
            [name, rfidcode, image, description],
            (tx, results) => {
                if (results.rowsAffected > 0) {
                    console.log('User inserted successfully');
                } else {
                    console.log('Insert failed');
                }
            },
            error => {
                console.error('Error inserting user: ', error);
            }
        );
    });
};

const db = SQLite.openDatabase(
    {
        name: 'compagnyAttendance.db',
        location: 'default',
    },
    () => {
        console.log('Database compagnyAttendance opened successfully');
    },
    error => {
        console.error('Error opening database: ', error);
    },
);

const createTableIfNotExists = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS africasystem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        rfidcode TEXT UNIQUE,
        image TEXT,
        description TEXT
      );`,
            [],
            () => {
                console.log('africasystem table created successfully');
            },
            error => {
                console.error('Error creating tables: ', error);
            }
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        checkin INTEGER DEFAULT 0,
        checkin_time DATETIME,
        checkout INTEGER DEFAULT 0,
        checkout_time DATETIME,
        FOREIGN KEY (id_user) REFERENCES africasystem(id) ON DELETE CASCADE ON UPDATE CASCADE
      );`,
            [],
            () => {
                console.log('Table attendance created successfully');
            },
            error => {
                console.error('Error creating attendance table: ', error);
            }
        );
    });
};


const getUserByRfidCode = (rfidcode, setSelectedUser, setModalVisible, selectedLanguage, isTtsEnabled) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM africasystem WHERE rfidcode = ?',
            [rfidcode],
            (tx, results) => {
                if (results.rows.length > 0) {
                    const user = results.rows.item(0);
                    setSelectedUser(user);
                    setModalVisible(true);
                    checkin_checkout(user, selectedLanguage, isTtsEnabled)
                } else {
                    Alert.alert('No user found with the given RFID code');
                }
            },
            error => {
                console.error('Error retrieving user by RFID code: ', error);
            },
        );
    });
};


const checkin_checkout = (user, selectedLanguage, isTtsEnabled) => {
    let date = new Date()
    let time_insert = date.toLocaleString();
    let currentHour = date.getHours();

    db.transaction(tx => {
        // Query from 'attendance' table
        tx.executeSql(
            'SELECT * FROM attendance WHERE id_user=? AND checkin=? AND checkout=? ORDER BY checkin_time DESC LIMIT 1',
            [user.id, 1, 0],
            (tx, results) => {
                if (results.rows.length > 0) {
                    // Update the record if a matching check-in is found

                    tx.executeSql(
                        'UPDATE attendance SET checkout=?, checkout_time=? WHERE id_user=? AND checkin=? AND checkout=?',
                        [1, time_insert, user.id, 1, 0],
                        (tx, results) => {

                            if (currentHour >= 10 && currentHour <= 15) {

                                if (isTtsEnabled) {
                                    let time = getFormattedTime();
                                    Tts.setDefaultLanguage(selectedLanguage).then(() => {
                                        Tts.speak(`${user.name} prend une pause à ${time}`);
                                    });
                                }

                            } else {

                                if (isTtsEnabled) {
                                    let time = getFormattedTime();
                                    Tts.setDefaultLanguage(selectedLanguage).then(() => {
                                        Tts.speak(`${user.name} rentre à ${time}`);
                                    });
                                }

                            }

                        },
                        error => {
                            console.error('Error during checkout: ', error);
                        },
                    );



                } else {
                    // Insert a new check-in if no matching record is found
                    tx.executeSql(
                        'INSERT INTO attendance (id_user, checkin, checkin_time) VALUES (?, ?, ?)',
                        [user.id, 1, time_insert],
                        (tx, results) => {
                            if (currentHour >= 10 && currentHour <= 15) {

                                if (isTtsEnabled) {
                                    let time = getFormattedTime();
                                    Tts.setDefaultLanguage(selectedLanguage).then(() => {
                                        Tts.speak(`${user.name} reviens de pause à ${time}`);
                                    });
                                }

                            } else {

                                if (isTtsEnabled) {
                                    let time = getFormattedTime();
                                    Tts.setDefaultLanguage(selectedLanguage).then(() => {
                                        Tts.speak(`${user.name} arrive à ${time}`);
                                    });
                                }

                            }

                        },
                        error => {
                            console.error('Error during checkin: ', error);
                        },
                    );
                }
            },
            error => {
                console.error('Error retrieving attendance record: ', error);
            },
        );
    });
};




const AttendencesNFC = () => {
    const [nfcTag, setNfcTag] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('fr-FR');
    const [isTtsEnabled, setIsTtsEnabled] = useState(true);
    const [addUserModalVisible, setAddUserModalVisible] = useState(false); // State for add user modal
    const [newUserName, setNewUserName] = useState(''); // Input for new user's name
    const [newUserRfidCode, setNewUserRfidCode] = useState(''); // Input for new user's RFID code
    const [newUserDescription, setNewUserDescription] = useState(''); // Input for new user's description
    const [newUserImage, setNewUserImage] = useState(''); // Input for new user's description
    const isSynchronised = useIsSyncing();
    const theme = useTheme();

    const nfcInputRef = useRef(null);

    const handleNfcInput = (rfidcode) => {
        setNfcTag(rfidcode);

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        typingTimeout = setTimeout(() => {
            getUserByRfidCode(rfidcode, setSelectedUser, setModalVisible, selectedLanguage, isTtsEnabled);

            if (clearTimeoutRef) {
                clearTimeout(clearTimeoutRef);
            }

            clearTimeoutRef = setTimeout(() => {
                setNfcTag('');
                setSelectedUser(null);
                setModalVisible(false);
                if (nfcInputRef.current) {
                    nfcInputRef.current.focus();
                }
            }, 5000);
        }, 500);
    };

    const handleAddUser = () => {
        if (!newUserName || !newUserRfidCode || !newUserDescription) {
            Alert.alert('Please fill in all fields');
            return;
        }

        insertIntoAfricasystem(newUserName, newUserRfidCode, `images/${newUserImage}.png`, newUserDescription);
        Alert.alert('User added successfully');
        setNewUserName('');
        setNewUserRfidCode('');
        setNewUserDescription('');
        setNewUserImage('');
        setAddUserModalVisible(false); // Close the modal after adding the user
    };

    // Keyboard.dismiss()
    useEffect(() => {
        // insertIntoAfricasystem('Arielle NTOH','1349278385','images/arielle.png', 'Agent support 1')
        // update()
        // deletes()
        createTableIfNotExists();
        if (nfcInputRef.current) {
            nfcInputRef.current.focus();
        }
        KeepAwake.activate();
        selectAllFromAfricasystem()

    }, []);

    return (
        <>
            {/* Modal for viewing user details */}
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
                                <Text style={styles.userName}>{selectedUser.name}</Text>
                                <Image
                                    source={selectedUser ? imageMapping[selectedUser.image] : require('../../../images/default.png')}
                                    style={styles.userImage}
                                />
                                <Text style={styles.userDescription}>{selectedUser.description}</Text>
                                <Button onPress={() => setModalVisible(false)}>Close</Button>
                            </>
                        ) : (
                            <Text>No user found</Text>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Modal for adding a new user */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={addUserModalVisible}
                onRequestClose={() => setAddUserModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New User</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Name:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter name"
                                value={newUserName}
                                onChangeText={setNewUserName}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>RFID Code:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter RFID code"
                                value={newUserRfidCode}
                                onChangeText={setNewUserRfidCode}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Description:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter description"
                                value={newUserDescription}
                                onChangeText={setNewUserDescription}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Image:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter the image location"
                                value={newUserImage}
                                onChangeText={setNewUserImage}
                            />
                        </View>
                        <Button onPress={handleAddUser}>Add User</Button>
                        <Button onPress={() => setAddUserModalVisible(false)}>Close</Button>
                    </View>
                </View>
            </Modal>


            <TouchableWithoutFeedback onPress={() => nfcInputRef.current && nfcInputRef.current.focus()}>
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

                        {/* Hidden TextInput to capture the NFC tag data */}
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
                    </ScrollView>
                </SafeAreaView>
            </TouchableWithoutFeedback>

        </>
    );
};

const styles = StyleSheet.create({
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
        width: 400,
        padding: 20,
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
        width: 300,
        height: 300,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        marginBottom: 10,
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
