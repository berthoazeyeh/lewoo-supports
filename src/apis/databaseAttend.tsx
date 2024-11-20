// @ts-ignore
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
// @ts-ignore
import SQLite from 'react-native-sqlite-storage';

// Ouvrir ou créer la base de données
export const db = SQLite.openDatabase(
    {
        name: 'compagnyAttendance.db',
        location: 'default',
    },
    () => { console.log('Base de données ouverte, compagnyAttendance.db') },
    (error: any) => { console.log('Erreur lors de l’ouverture de la base de données', error) }
);


export const createTableForAttendance = async (db: any) => {
    db.transaction((tx: any) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS africasystem (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                rfidcode TEXT ,
                image TEXT,
                description TEXT
            );`,
            [],
            () => {
                console.log('africasystem table created successfully');
            },
            (error: any) => {
                console.error('Error creating tables: ', error);
            }
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT, 
                email TEXT, 
                partner_id TEXT,
                phone TEXT,
                role TEXT,
                password TEXT
                );`,
            [],
            () => { console.log('Table Users créée avec succès') },
            (error: any) => { console.log('Erreur lors de la création de la table Users', error) }
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_user INTEGER NOT NULL,
            make_attendance_id INTEGER,
            is_checkin BOOLEAN DEFAULT 1,
            checkin_time DATETIME,
            checkout_time DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            isLocal BOOLEAN DEFAULT 1,
            longitude TEXT,
            latitude TEXT,
            UNIQUE (id_user, checkin_time),
            FOREIGN KEY (id_user) REFERENCES africasystem(id) ON DELETE CASCADE ON UPDATE CASCADE
        );`,
            [],
            () => {
                console.log('Table attendance created successfully');
            },
            (error: any) => {
                console.error('Error creating attendance table: ', error);
            }
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS attendance_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT,
                datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
                activity_name TEXT,
                rfid_code TEXT NOT NULL,
                status TEXT,
                message TEXT
            );`,
            [],
            () => {
                console.log('Table attendance_log created successfully');
            },
            (error: any) => {
                console.error('Error creating attendance_log table: ', error);
            }
        );
    });


};

export const update = () => {
    db.transaction((tx: any) => {
        tx.executeSql(
            `UPDATE africasystem SET description=? where rfidcode=?`,
            ['Technicien', '2574247916'],
            (tx: any, results: any) => {
                const rows = results.rows;
                let data = [];
                for (let i = 0; i < rows.length; i++) {
                    data.push(rows.item(i));
                }
                console.log('Retrieved data from africasystem:', data);
            },
            (error: any) => {
                console.error('Error retrieving data from africasystem:', error);
            }
        );
    });
};


export const deletes = () => {
    db.transaction((tx: any) => {
        tx.executeSql(
            `DELETE FROM attendance where id>?`,
            [0],
            (tx: any, results: any) => {
                const rows = results.rows;
                let data = [];

                for (let i = 0; i < rows.length; i++) {
                    data.push(rows.item(i));
                }
                console.log('Retrieved data from africasystem:', data);
            },
            (error: any) => {
                console.error('Error retrieving data from africasystem:', error);
            }
        );
    });
};
export function syncAllPartners(requests: any) {
    return new Promise((resolve, reject) => {
        db.transaction(function (tx: any) {
            let queryPromises = requests.map((request: any) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT id FROM africasystem WHERE id = ?',
                        [request.id],
                        function (tx: any, results: any) {
                            if (results.rows.length > 0) {
                                tx.executeSql(
                                    `UPDATE africasystem
                                    SET 
                                        name = ?,
                                        rfidcode = ?,
                                        image = ?,
                                        description = ?
                                        
                                    WHERE id = ?`,
                                    [
                                        request.name || "",
                                        request.rfid_code + "" || "",
                                        request.image_1920 + "" || "",
                                        request.name || "",
                                        request.id,
                                    ],
                                    () => resolveQuery('Updated: ' + request.id), // Réussite de la mise à jour
                                    (tx: any, error: any) => rejectQuery('Update failed: ' + request.id + ' ' + error.message) // Échec de la mise à jour
                                );
                            } else {
                                // L'ID n'existe pas, on insère un nouveau record
                                tx.executeSql(
                                    `INSERT INTO africasystem (
                                        id, name, rfidcode, image,
                                        description)
                                    VALUES (?, ?, ?, ?, ?)`,
                                    [
                                        request.id,
                                        request.name || "",
                                        request.rfid_code + "" || "",
                                        request.image_1920 + "" || "",
                                        request.name || "",
                                    ],
                                    () => resolveQuery('Inserted: ' + request.id), // Réussite de l'insertion
                                    (tx: any, error: any) => rejectQuery('Insert failed: ' + request.id + ' ' + error.message) // Échec de l'insertion
                                );
                            }
                        }
                    );
                });
            });
            // Attendre que toutes les requêtes soient terminées
            Promise.all(queryPromises)
                .then((results) => resolve(results)) // Toutes les requêtes réussies
                .catch((error) => reject(error)); // Au moins une requête a échoué
        });
    });
}
export function syncAllAttendence(requests: any) {
    return new Promise((resolve, reject) => {
        db.transaction(function (tx: any) {
            let queryPromises = requests.map((request: any) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT id FROM africasystem WHERE id = ?',
                        [request.id],
                        function (tx: any, results: any) {
                            if (results.rows.length > 0) {
                                tx.executeSql(
                                    `UPDATE africasystem
                                    SET 
                                        name = ?,
                                        rfidcode = ?,
                                        image = ?,
                                        description = ?
                                        
                                    WHERE id = ?`,
                                    [
                                        request.name || "",
                                        request.rfid_code + "" || "",
                                        request.image_1920 + "" || "",
                                        request.name || "",
                                        request.id,
                                    ],
                                    () => resolveQuery('Updated: ' + request.id), // Réussite de la mise à jour
                                    (tx: any, error: any) => rejectQuery('Update failed: ' + request.id + ' ' + error.message) // Échec de la mise à jour
                                );
                            } else {
                                // L'ID n'existe pas, on insère un nouveau record
                                tx.executeSql(
                                    `INSERT INTO africasystem (
                                        id, name, rfidcode, image,
                                        description)
                                    VALUES (?, ?, ?, ?, ?)`,
                                    [
                                        request.id,
                                        request.name || "",
                                        request.rfid_code + "" || "",
                                        request.image_1920 + "" || "",
                                        request.name || "",
                                    ],
                                    () => resolveQuery('Inserted: ' + request.id), // Réussite de l'insertion
                                    (tx: any, error: any) => rejectQuery('Insert failed: ' + request.id + ' ' + error.message) // Échec de l'insertion
                                );
                            }
                        }
                    );
                });
            });
            // Attendre que toutes les requêtes soient terminées
            Promise.all(queryPromises)
                .then((results) => resolve(results)) // Toutes les requêtes réussies
                .catch((error) => reject(error)); // Au moins une requête a échoué
        });
    });
}


export const getAllAttendances = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT attendance.*,
                africasystem.name AS user_name,
                africasystem.id AS user_id
                FROM attendance
                LEFT JOIN africasystem ON attendance.id_user = africasystem.id
                ORDER BY attendance.created_at DESC;`,
                [],
                (tx: any, results: any) => {
                    const requests = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        requests.push(results.rows.item(i));
                    }
                    resolve(({ data: requests, success: true }));  // Résoudre la promesse avec le tableau d'utilisateurs

                },
                (error: any) => {
                    resolve({ ...error, success: false });  // Rejeter la promesse en cas d'erreur
                }
            );
        });
    });

};
export const getFilterAttendances = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT a.*,
                af.name AS user_name,
                af.rfidcode ,
                af.id AS user_id
                FROM africasystem af
                LEFT JOIN attendance a ON a.id_user = af.id AND a.updated_at = (
                SELECT MAX(updated_at) 
                    FROM attendance 
                    WHERE id_user = af.id
            )
                ORDER BY af.name ASC; `,
                [],
                (tx: any, results: any) => {
                    const requests = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        requests.push(results.rows.item(i));
                    }
                    resolve(({ data: requests, success: true }));  // Résoudre la promesse avec le tableau d'utilisateurs

                },
                (error: any) => {
                    resolve({ ...error, success: false });  // Rejeter la promesse en cas d'erreur
                }
            );
        });
    });

};


export const getFilterAttendancesOneUser = (userId: number) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT a.*,
                    af.name AS user_name,
                    af.rfidcode,
                    af.id AS user_id
                FROM africasystem af
                LEFT JOIN attendance a ON a.id_user = af.id 
                    AND a.updated_at = (
                        SELECT MAX(updated_at)
                        FROM attendance
                        WHERE id_user = af.id
                    )
                WHERE af.id = ? -- Filtrer par l'ID utilisateur
                ORDER BY af.name ASC;`,
                [userId],
                (tx: any, results: any) => {
                    const requests = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        requests.push(results.rows.item(i));
                    }
                    resolve({ data: requests, success: true });
                },
                (error: any) => {
                    resolve({ ...error, success: false, message: error.message });
                }
            );
        });
    });
};



export const updateAttententLocal = (id: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `UPDATE attendance SET  isLocal = ? WHERE id = ?;`,
                [0, id],
                () => resolve({ data: 'types', success: true }), // Résoudre si la suppression réussit
                (tx: any, error: any) => resolve({ ...error, success: false })
            );
        });
    });
};
export const getUnSyncAttendance = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM attendance  WHERE isLocal = 1  ORDER BY updated_at ASC;`,
                [],
                (tx: any, results: any) => {
                    const requests = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        requests.push(results.rows.item(i));
                    }
                    resolve(({ data: requests, success: true }));

                },
                (error: any) => {
                    resolve({ ...error, success: false });
                }
            );
        });
    });

};
export const getUnSyncAttendanceLogs = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM attendance_log   ORDER BY datetime ASC;`,
                [],
                (tx: any, results: any) => {
                    const requests = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        requests.push(results.rows.item(i));
                    }
                    resolve(({ data: requests, success: true }));

                },
                (error: any) => {
                    resolve({ ...error, success: false });
                }
            );
        });
    });

};



export const deleteAttententLogs = (id: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `DELETE FROM attendance_log WHERE id = ?;`,
                [id],
                () => resolve({ data: 'types', success: true }), // Résoudre si la suppression réussit
                (tx: any, error: any) => resolve({ ...error, success: false })
            );
        });
    });
};


export const upsertAttendance = async (dataList: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            dataList.forEach((data: any) => {
                const { id, name } = data.employee;
                const recordId = data.id; // ID unique dans l'objet attendance
                const checkinTime = data.check_in;
                const checkoutTime = data.check_out || null;
                const isCheckin = !!data.check_in && !data.check_out;
                const createdAt = data.create_date;

                // Vérifier si l'enregistrement existe déjà
                tx.executeSql(
                    `SELECT * FROM attendance WHERE id = ?;`,
                    [recordId],
                    (_: any, { rows }: any) => {
                        if (rows.length === 0) {
                            // Si l'enregistrement n'existe pas, rechercher la dernière ligne avec isLocal = true
                            tx.executeSql(
                                `SELECT * FROM attendance WHERE id_user = ? AND isLocal = 1 ORDER BY created_at DESC LIMIT 1;`,
                                [id],
                                (_: any, { rows: localRows }: any) => {
                                    if (localRows.length === 0) {
                                        // Aucune ligne locale, insérer la nouvelle ligne
                                        tx.executeSql(
                                            `INSERT INTO attendance (id, id_user, is_checkin, checkin_time, checkout_time, created_at, isLocal) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                                            [recordId, id, isCheckin, checkinTime, checkoutTime, createdAt, 0],
                                            () => {
                                                console.log(`Nouvelle entrée insérée pour ${name} avec l'ID ${recordId}`);
                                            },
                                            (_: any, error: any) => {
                                                console.log(`Erreur lors de l'insertion pour 00000000${name}   ${recordId}`, error);
                                            }
                                        );
                                    } else {
                                        // Comparer avec la dernière ligne locale
                                        const lastLocalEntry = localRows.item(0);
                                        const hasChanged =
                                            lastLocalEntry.checkin_time !== checkinTime ||
                                            lastLocalEntry.checkout_time !== checkoutTime;

                                        if (hasChanged) {
                                            // Supprimer l'ancienne ligne locale et insérer la nouvelle
                                            tx.executeSql(
                                                `DELETE FROM attendance WHERE id = ?;`,
                                                [lastLocalEntry.id],
                                                () => {
                                                    tx.executeSql(
                                                        `INSERT INTO attendance (id, id_user, is_checkin, checkin_time, checkout_time, created_at, isLocal) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                                                        [recordId, id, isCheckin, checkinTime, checkoutTime || lastLocalEntry.checkout_time, createdAt, 0],
                                                        () => {
                                                            console.log(`Ancienne entrée supprimée et nouvelle entrée insérée pour ${name} avec l'ID ${recordId}`);
                                                        },
                                                        (_: any, error: any) => {
                                                            console.log(`Erreur lors de la réinsertion pour ${name}`, error);
                                                        }
                                                    );
                                                },
                                                (_: any, error: any) => {
                                                    console.log(`Erreur lors de la suppression de l'ancienne entrée pour ${name}`, error);
                                                }
                                            );
                                        } else {
                                            console.log(`Aucune modification pour ${name} avec l'ID ${recordId}`);
                                        }
                                    }
                                },
                                (_: any, error: any) => {
                                    console.log(`Erreur lors de la vérification de la dernière entrée locale pour ${name}`, error);
                                    reject(`Erreur lors de la vérification de la dernière entrée locale pour ${name}`);
                                }
                            );
                        } else {
                            const existingEntry = rows.item(0);
                            // Vérifier si les données ont changé
                            const hasChanged =
                                existingEntry.checkin_time !== checkinTime ||
                                existingEntry.checkout_time !== checkoutTime;
                            if (hasChanged && existingEntry.isLocal === 0) {
                                // Mettre à jour uniquement si les données sont différentes
                                tx.executeSql(
                                    `UPDATE attendance SET is_checkin = ?, checkin_time = ?, checkout_time = ?, isLocal = ? WHERE id = ?;`,
                                    [isCheckin, checkinTime, checkoutTime, 0, recordId],
                                    () => {
                                        console.log(`Entrée mise à jour pour ${name} avec l'ID ${recordId}`);
                                    },
                                    (_: any, error: any) => {
                                        console.log(`Erreur lors de la mise à jour pour ${name}`, error);
                                    }
                                );
                            } else {
                                console.log(`Aucune modification pour ${name} avec l'ID ${recordId}`);
                                // tx.executeSql(
                                //     `UPDATE attendance SET  isLocal = ? WHERE id = ?;`,
                                //     [0, recordId],
                                //     () => {
                                //     },
                                //     (_: any, error: any) => {
                                //         console.log(`Erreur lors de la mise à jour pour ${name}`, error);
                                //     }
                                // );
                            }
                        }
                    },
                    (_: any, error: any) => {
                        console.log(`Erreur lors de la vérification de l'existence pour ${name}`, error);
                        reject(`Erreur lors de la vérification de l'existence pour ${name}`);
                    }
                );
            });

            resolve("Opération terminée pour tous les éléments de la liste");
        });
    });
};



export const handleCreateAttendanceCorrect = async (id_user: any, user_name: string, rfid_code: string, make_attendance_id: Number | null, timing: number, coords: any, checktime: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            // Vérifier la dernière ligne de l'utilisateur
            tx.executeSql(
                `SELECT * FROM attendance WHERE id_user = ? ORDER BY updated_at DESC LIMIT 1;`,
                [id_user],
                (_: any, { rows }: any) => {
                    const currentTime = new Date().toISOString();
                    const currentHour = new Date().getHours();
                    const create_at = new Date().toISOString();
                    const updated_at = new Date().toISOString();
                    let longitude = coords && coords.longitude ? coords.longitude : null;
                    let latitude = coords && coords.latitude ? coords.latitude : null;
                    let is_checkin: boolean;
                    let checkin_time = null;
                    let checkout_time = null;
                    // Déterminer le message d'accueil en fonction de l'heure
                    let greeting = '';
                    if (currentHour >= 5 && currentHour < 12) {
                        greeting = 'Bonjour ';
                    } else if (currentHour >= 12 && currentHour < 15) {
                        greeting = 'Bon après-midi ';
                    } else {
                        greeting = 'Bonsoir ';
                    }

                    let finalMessage = '';
                    if (rows.length === 0) {
                        // Aucun enregistrement existant => on fait un check-in
                        is_checkin = true;
                        checkin_time = checktime ?? currentTime;

                        finalMessage = `${greeting} ${user_name}, Bienvenue! Vous venez de vous enregistrer à : ${moment().format("HH:mm")}`;
                        // Insérer une nouvelle ligne de check-in
                        tx.executeSql(
                            `INSERT INTO attendance (id_user, is_checkin, checkin_time, checkout_time, created_at, updated_at,make_attendance_id, longitude,latitude) VALUES (?, ?, ?, ?, ?,?,?,?,?);`,
                            [id_user, is_checkin, checkin_time, checkout_time, create_at, updated_at, make_attendance_id, longitude, latitude],
                            () => {
                                console.log("Aucun enregistrement existant => on fait un check-in");
                                resolve({ data: is_checkin, success: true, message: finalMessage });
                            },
                            (_: any, error: any) => {
                                console.log("Erreur lors de l'insertion", error);
                                resolve({ data: is_checkin, success: false, message: 'Erreur lors de l\'insertion' });
                            }
                        );
                        tx.executeSql(
                            `INSERT INTO attendance_log (nom, datetime, activity_name, rfid_code, status, message) VALUES (?, ?, ?, ?, ?, ?);`,
                            [user_name, create_at, 'check_in', rfid_code, "success", finalMessage],
                            () => {
                                console.log(`Nouvelle entrée insérée dans attendance_log pour ${user_name} avec l'ID ${rfid_code}`);
                            },
                            (_: any, error: any) => {
                                console.log(`Erreur lors de l'insertion pour------- ${user_name}`, _, error);
                            }
                        );
                    } else {
                        const lastEntry = rows.item(0);
                        const checkin = new Date(lastEntry?.checkout_time ? lastEntry.checkout_time : lastEntry.checkin_time)
                        const current = checktime ? new Date(checktime) : new Date();   // Exemple de date 2
                        // Calculer la différence en millisecondes
                        const timeDifference = current.getTime() - checkin.getTime();
                        // Convertir la différence en minutes
                        const minutesDifference = timeDifference / (1000 * 60);
                        console.log("minutesDifference========================", minutesDifference, timing);
                        if (minutesDifference <= timing) {
                            let minutes = Math.floor(minutesDifference);
                            let seconds = Math.round((minutesDifference - minutes) * 60);
                            finalMessage = `${user_name}, vous avez badgé il y a ${minutes} minutes et ${seconds} secondes. Vous pouvez encore badger dans ${Math.floor(5 - minutesDifference)} minutes.`
                            tx.executeSql(
                                `INSERT INTO attendance_log (nom, datetime, activity_name, rfid_code, status, message) VALUES (?, ?, ?, ?, ?, ?);`,
                                [user_name, create_at, 'unknow', rfid_code, "failed", finalMessage],
                                () => {
                                    console.log(`Nouvelle entrée insérée dans attendance_log pour ${user_name} avec l'ID ${rfid_code}`);
                                },
                                (_: any, error: any) => {
                                    console.log(`Erreur lors de l'insertion pour------- ${user_name}`, _, error);
                                }
                            );

                            resolve({ data: {}, success: false, message: finalMessage });
                        }
                        else
                            if (lastEntry.checkin_time && !lastEntry.checkout_time) {
                                // Dernière entrée est un check-in sans check-out => faire un check-out
                                is_checkin = false;
                                checkout_time = checktime ?? currentTime;
                                finalMessage = `${greeting} ${user_name}, Au revoir! Vous venez de quitter à : ${moment().format("HH:mm")}`;

                                // Mettre à jour la dernière ligne pour ajouter le check-out
                                tx.executeSql(
                                    `UPDATE attendance SET checkout_time = ? ,isLocal= ? , updated_at=?, make_attendance_id=?,  longitude=?, latitude=? WHERE id = ?;`,
                                    [checkout_time, 1, updated_at, make_attendance_id, longitude, latitude, lastEntry.id],
                                    () => {
                                        console.log("Dernière entrée est un check-in sans check-out => faire un check-out");

                                        resolve({ data: is_checkin, success: true, message: finalMessage });
                                    },
                                    (_: any, error: any) => {
                                        console.log("Erreur lors de la mise à jour", error);
                                        resolve({ data: is_checkin, success: false, message: 'Erreur lors de la mise à jour' });
                                    }
                                );
                                tx.executeSql(
                                    `INSERT INTO attendance_log (nom, datetime, activity_name, rfid_code, status, message) VALUES (?, ?, ?, ?, ?, ?);`,
                                    [user_name, create_at, 'check_out', rfid_code, "success", finalMessage],
                                    () => {
                                        console.log(`Nouvelle entrée insérée dans attendance_log pour ${user_name} avec l'ID ${rfid_code}`);
                                    },
                                    (_: any, error: any) => {
                                        console.log(`Erreur lors de l'insertion pour------- ${user_name}`, _, error);
                                    }
                                );
                            } else {
                                // Dernière entrée est un check-out ou un check-in avec check-out => faire un nouveau check-in
                                is_checkin = true;
                                checkin_time = checktime ?? currentTime;

                                // Insérer une nouvelle ligne de check-in
                                finalMessage = `${greeting} ${user_name}, Bienvenue! Vous venez de vous enregistrer à : ${moment().format("HH:mm")}`;
                                tx.executeSql(
                                    `INSERT INTO attendance (id_user, is_checkin, checkin_time, checkout_time, created_at, updated_at, make_attendance_id, longitude, latitude) VALUES (?, ?, ?, ?, ?, ?,?,?,?);`,
                                    [id_user, is_checkin, checkin_time, checkout_time, create_at, updated_at, make_attendance_id, longitude, latitude],
                                    () => {
                                        console.log("Dernière entrée est un check-out ou un check-in avec check-out => faire un nouveau check-in");

                                        resolve({ data: is_checkin, success: true, message: finalMessage });
                                    },
                                    (_: any, error: any) => {
                                        console.log("Erreur lors de l'insertion", error);
                                        resolve({ data: is_checkin, success: false, message: 'Erreur lors de l\'insertion' });
                                    }
                                );

                                tx.executeSql(
                                    `INSERT INTO attendance_log (nom, datetime, activity_name, rfid_code, status, message) VALUES (?, ?, ?, ?, ?, ?);`,
                                    [user_name, create_at, 'check_in', rfid_code, "success", finalMessage],
                                    () => {
                                        console.log(`Nouvelle entrée insérée dans attendance_log pour ${user_name} avec l'ID ${rfid_code}`);
                                    },
                                    (_: any, error: any) => {
                                        console.log(`Erreur lors de l'insertion pour------- ${user_name}`, _, error);
                                    }
                                );
                            }
                    };


                },
                (_: any, error: any) => {
                    console.log("Erreur lors de la vérification", error);
                    reject("Erreur lors de la vérification");
                }
            );
        });
    });
};







export const getUserByRfidCodes = async (rfidCode: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: { executeSql: (arg0: string, arg1: any[], arg2: (_: any, { rows }: { rows: any; }) => void, arg3: (_: any, error: any) => void) => void; }) => {
            tx.executeSql(
                `SELECT * FROM africasystem WHERE rfidcode = ?;`,
                [rfidCode],
                (_: any, { rows }: any) => {
                    if (rows.length > 0) {
                        const user = rows.item(0); // Récupère le premier utilisateur correspondant
                        resolve({ success: true, data: user, message: "Renvoie de l'utilisateur" }); // Renvoie l'utilisateur
                    } else {
                        resolve({ success: false, data: {}, message: "Aucun utilisateur trouvé avec ce rfidcode" });
                        reject('');
                    }
                },
                (_: any, error: any) => {
                    console.log('Erreur lors de la récupération de l\'utilisateur', error);
                    resolve({ success: false, data: {}, message: "Erreur lors de la récupération de l\'utilisateur" });
                }
            );
        });
    });
};


type GeoLocationResponse = {
    success: boolean;
    latitude?: number;
    longitude?: number;
    error?: string;
};

// Fonction pour obtenir la position actuelle
export const getCurrentLocation = (): Promise<GeoLocationResponse> => {
    return new Promise((resolve) => {
        Geolocation.getCurrentPosition(
            (location) => {
                const { latitude, longitude } = location.coords;
                resolve({
                    success: true,
                    latitude,
                    longitude,
                });
            },
            (error) => {
                console.log({ error });
                resolve({
                    success: false,
                    error: error.message,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
            }
        );
    });
};



export const loginUserWithPartner = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            // Faire une jointure entre Users et Partner pour obtenir toutes les informations
            tx.executeSql(
                `SELECT * FROM Users WHERE Users.email = ? AND Users.password = ?;`,
                [email, password],
                (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                        let user = results.rows.item(0); // Récupérer les informations de l'utilisateur et du partenaire
                        resolve({ success: true, data: user }); // Renvoie toutes les informations (utilisateur + partenaire)
                    } else {
                        resolve({
                            success: false, message: 'Email ou mot de passe incorrect'
                        });
                    }
                },
                (error: any) => {
                    resolve({ success: false, message: 'Erreur lors de la connexion: ' + error.message });

                }
            );
        });
    });
};


export const createUserWithPartner = (id: number, name: string, email: string, password: string, phone: string, role: string, partner_id: number) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            // Vérifier si l'email existe déjà
            tx.executeSql(
                'SELECT * FROM Users WHERE email = ?;',
                [email],
                (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                        resolve({ success: false, message: 'Cet email est déjà utilisé.' });
                    } else {
                        // Insérer un nouvel utilisateur dans la table Users
                        tx.executeSql(
                            'INSERT INTO Users (id, name, email, password, partner_id, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?);',
                            [id, name, email, password, partner_id, phone, role],
                            (tx: any, userResults: any) => {
                                const userId = userResults.insertId; // Récupérer l'ID de l'utilisateur inséré
                                resolve({ success: true, message: 'Utilisateur et partenaire créés avec succès', data: { phone, role, name, email, password, id, user_id: userId } });
                            },
                            (error: any) => {
                                resolve({ success: false, message: 'Erreur lors de la création de l’utilisateur: ' + error.message });
                            }
                        );
                    }
                },
                (error: any) => {
                    reject('Erreur lors de la vérification de l’email: ' + error.message);
                }
            );
        });
    });
};