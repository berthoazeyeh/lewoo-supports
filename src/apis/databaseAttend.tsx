// @ts-ignore
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
            `CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_user INTEGER NOT NULL,
            is_checkin BOOLEAN DEFAULT 1,
            checkin_time DATETIME,
            checkout_time DATETIME,
            created_at DATETIME,
            isLocal BOOLEAN DEFAULT 1,
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

export function syncAllEmployee(requests: any) {
    return new Promise((resolve, reject) => {
        db.transaction(function (tx: any) {
            let queryPromises = requests.map((request: any) => {
                return new Promise((resolveQuery, rejectQuery) => {


                    // Requête pour vérifier si l'ID existe déjà
                    tx.executeSql(
                        'SELECT id FROM africasystem WHERE id = ?',
                        [request.id],
                        function (tx: any, results: any) {
                            if (results.rows.length > 0) {
                                // L'ID existe déjà, on met à jour
                                console.log("Existe---------", request.id);

                                tx.executeSql(
                                    `UPDATE africasystem
                                    SET 
                                        name = ?,
                                        rfidcode = ?,
                                        image = ?,
                                        description = ?,
                                        
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
                                console.log("Existe   pas+++++++++++++++++++++---------", request.id);

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
                                        request.image_128 + "" || "",
                                        request.name || "",
                                    ],
                                    () => {


                                        resolveQuery('Inserted: ' + request.id);
                                    }, // Réussite de l'insertion
                                    (tx: any, error: any) => {
                                        rejectQuery('Insert failed: ' + request.id + ' ' + error.message);
                                        console.warn(request.id,
                                            request.name || "",
                                            request.rfid_code + "" || "",
                                            request.image_128 + "" || "",
                                            request.name || "",);

                                    }// Échec de l'insertion
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
export const updateAttententLocal = (id: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `UPDATE attendance
                SET 
                    isLocal = ? 
                WHERE id = ?`,
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
                `SELECT * FROM attendance  WHERE isLocal = 1;`,
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

export const bulkInsertAttendance = async (dataList: any[]) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            dataList.forEach((data, index) => {
                const { id, name } = data.employee;
                const checkinTime = data.check_in;
                const checkoutTime = data.check_out || null;  // Pour les entrées sans checkout
                const createdAt = data.create_date;

                // Vérifier la dernière ligne de l'utilisateur
                tx.executeSql(
                    `SELECT * FROM attendance WHERE id_user = ? ORDER BY created_at DESC LIMIT 1;`,
                    [id],
                    (_: any, { rows }: any) => {
                        if (rows.length === 0) {
                            // Pas d'entrée existante pour cet utilisateur => faire un check-in
                            tx.executeSql(
                                `INSERT INTO attendance (id_user, is_checkin, checkin_time, checkout_time, created_at, isLocal) VALUES (?, ?, ?, ?, ?,?);`,
                                [id, true, checkinTime, null, createdAt, 0],
                                () => {
                                    console.log(`Check-in inséré pour ${name} à l'index ${index}`);
                                },
                                (_: any, error: any) => {
                                    console.log(`Erreur lors de l'insertion du check-in pour ${name}`, error);
                                }
                            );
                        } else {
                            const lastEntry = rows.item(0);

                            if (lastEntry.is_checkin && !lastEntry.checkout_time) {
                                // Dernière entrée est un check-in sans check-out => mettre à jour pour un check-out
                                tx.executeSql(
                                    `UPDATE attendance SET checkout_time = ?, isLocal= ?  WHERE id = ?;`,
                                    [checkoutTime, 0, lastEntry.id],
                                    () => {
                                        console.log(`Check-out mis à jour pour ${name} à l'index ${index}`);
                                    },
                                    (_: any, error: any) => {
                                        console.log(`Erreur lors de la mise à jour du check-out pour ${name}`, error);
                                    }
                                );
                            } else {
                                // Dernière entrée est un check-out ou un check-in avec check-out => faire un nouveau check-in
                                tx.executeSql(
                                    `INSERT INTO attendance (id_user, is_checkin, checkin_time, checkout_time, created_at,isLocal) VALUES (?, ?, ?, ?, ?,?);`,
                                    [id, true, checkinTime, checkoutTime, createdAt, 0],
                                    () => {
                                        console.log(`Check-in inséré pour ${name} à l'index ${index}`);
                                    },
                                    (_: any, error: any) => {
                                        console.log(`Erreur lors de l'insertion du check-in pour ${name}`, error);
                                    }
                                );
                            }
                        }
                    },
                    (_: any, error: any) => {
                        console.log(`Erreur lors de la vérification pour ${name}`, error);
                        reject(`Erreur lors de la vérification pour ${name}`);
                    }
                );
            });

            resolve("Insertion terminée pour tous les éléments de la liste");
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
                                                console.log(`Erreur lors de l'insertion pour ${name}`, error);
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
                            if (hasChanged) {
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



export const handleCreateAttendanceCorrect = async (id_user: any, user_name: string) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            // Vérifier la dernière ligne de l'utilisateur
            tx.executeSql(
                `SELECT * FROM attendance WHERE id_user = ? ORDER BY created_at DESC LIMIT 1;`,
                [id_user],
                (_: any, { rows }: any) => {
                    const currentTime = new Date().toISOString();
                    const currentHour = new Date().getHours();
                    const create_at = new Date().toISOString();
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
                        checkin_time = currentTime;

                        // Insérer une nouvelle ligne de check-in
                        tx.executeSql(
                            `INSERT INTO attendance (id_user, is_checkin, checkin_time, checkout_time, created_at) VALUES (?, ?, ?, ?, ?);`,
                            [id_user, is_checkin, checkin_time, checkout_time, create_at],
                            () => {
                                console.log("Aucun enregistrement existant => on fait un check-in");
                                finalMessage = `${greeting} ${user_name}, Bienvenue! Vous venez de vous enregistrer à : ${moment().format("HH:mm")}`;
                                resolve({ data: is_checkin, success: true, message: finalMessage });
                            },
                            (_: any, error: any) => {
                                console.log("Erreur lors de l'insertion", error);
                                resolve({ data: is_checkin, success: false, message: 'Erreur lors de l\'insertion' });
                            }
                        );
                    } else {
                        const lastEntry = rows.item(0);

                        if (lastEntry.is_checkin && !lastEntry.checkout_time) {
                            // Dernière entrée est un check-in sans check-out => faire un check-out
                            is_checkin = false;
                            checkout_time = currentTime;

                            // Mettre à jour la dernière ligne pour ajouter le check-out
                            tx.executeSql(
                                `UPDATE attendance SET checkout_time = ?,isLocal= ? WHERE id = ?;`,
                                [checkout_time, 1, lastEntry.id],
                                () => {
                                    console.log("Dernière entrée est un check-in sans check-out => faire un check-out");

                                    finalMessage = `${greeting} ${user_name}, Au revoir! Vous venez de quitter à : ${moment().format("HH:mm")}`;
                                    resolve({ data: is_checkin, success: true, message: finalMessage });
                                },
                                (_: any, error: any) => {
                                    console.log("Erreur lors de la mise à jour", error);
                                    resolve({ data: is_checkin, success: false, message: 'Erreur lors de la mise à jour' });
                                }
                            );
                        } else {
                            // Dernière entrée est un check-out ou un check-in avec check-out => faire un nouveau check-in
                            is_checkin = true;
                            checkin_time = currentTime;

                            // Insérer une nouvelle ligne de check-in
                            tx.executeSql(
                                `INSERT INTO attendance (id_user, is_checkin, checkin_time, checkout_time, created_at) VALUES (?, ?, ?, ?, ?);`,
                                [id_user, is_checkin, checkin_time, checkout_time, create_at],
                                () => {
                                    console.log("Dernière entrée est un check-out ou un check-in avec check-out => faire un nouveau check-in");

                                    finalMessage = `${greeting} ${user_name}, Bienvenue! Vous venez de vous enregistrer à : ${moment().format("HH:mm")}`;
                                    resolve({ data: is_checkin, success: true, message: finalMessage });
                                },
                                (_: any, error: any) => {
                                    console.log("Erreur lors de l'insertion", error);
                                    resolve({ data: is_checkin, success: false, message: 'Erreur lors de l\'insertion' });
                                }
                            );
                        }
                    }
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


