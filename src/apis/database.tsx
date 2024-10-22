// @ts-ignore
import moment from 'moment';
// @ts-ignore
import SQLite from 'react-native-sqlite-storage';

// Ouvrir ou créer la base de données
export const db = SQLite.openDatabase(
    {
        name: 'zandpdatabase',
        location: 'default',
    },
    () => { console.log('Base de données ouverte') },
    (error: any) => { console.log('Erreur lors de l’ouverture de la base de données', error) }
);

// Fonction pour récupérer un utilisateur par son email
export const getUserByEmail = (email: string) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                'SELECT * FROM Users WHERE email = ?;',
                [email],  // Paramètre de la requête SQL
                (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                        let user = results.rows.item(0);  // Récupérer le premier utilisateur trouvé
                        resolve(user);  // Résoudre la promesse avec l'utilisateur trouvé
                    } else {
                        resolve(null);  // Aucune correspondance, retourner null
                    }
                },
                (error: any) => {
                    console.log('Erreur lors de la récupération de l’utilisateur', error);
                    reject(error);  // Rejeter la promesse en cas d'erreur
                }
            );
        });
    });
};



export const createTable = async (db: any) => {
    db.transaction((tx: any) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT, 
                email TEXT, 
                password TEXT
                );`,
            [],
            () => { console.log('Table Users créée avec succès') },
            (error: any) => { console.log('Erreur lors de la création de la table Users', error) }
        );

        // Créer la table Partner avec une clé étrangère référencée sur Users
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Partners (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                phone TEXT, 
                role TEXT, 
                mobile TEXT, 
                address TEXT, 
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES Users(id)
                );`,

            [],
            () => { console.log('Table Partner créée avec succès') },
            (error: any) => { console.log('Erreur lors de la création de la table Partner', error) }
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Partner (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT,
               rfid_code TEXT,
               image_128 TEXT
                );`,

            [],
            () => { console.log('Table Partner(client) créée avec succès') },
            (error: any) => { console.log('Erreur lors de la création de la table Partner', error) }
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Categorys (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT
                );`,

            [],
            () => { console.log('Table Categorys créée avec succès') },
            (error: any) => { console.log('Erreur lors de la création de la table Categorys', error) }
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Companys (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT
                );`,

            [],
            () => { console.log('Table Companys créée avec succès') },
            (error: any) => { console.log('Erreur lors de la création de la table Companys', error) }
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Types (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT,
                category_id INTEGER,
                FOREIGN KEY (category_id) REFERENCES Categorys(id)
                );`,

            [],
            () => { console.log('Table Types créée avec succès') },
            (error: any) => { console.log('Erreur lors de la création de la table Types', error) }
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY,
            activation_date TEXT,
            category_id INTEGER,
            date_assigned TEXT,
            date_closed TEXT,
            date_created TEXT,
            deadline_state TEXT,
            impact TEXT,
            name TEXT,
            partner_id INTEGER,
            author_id INTEGER,
            company_id INTEGER DEFAULT 1,
            priority TEXT,
            request_text TEXT,
            stage_name TEXT,
            start_date TEXT,
            type_id INTEGER,
            urgency TEXT,
            isLocal BOOLEAN DEFAULT 1,
            FOREIGN KEY (type_id) REFERENCES Types(id),
            FOREIGN KEY (category_id) REFERENCES Categorys(id),
            FOREIGN KEY (partner_id) REFERENCES Partners(id)
            FOREIGN KEY (author_id) REFERENCES Partners(id)
            );`,
            [],
            () => { console.log('Table requests créée avec succès') },
            (error: any) => { console.log('Erreur lors de la création de la table requests', error) }
        );

    });


};
export const dropTable = async (db: any) => {
    db.transaction((tx: any) => {
        tx.executeSql(
            `DROP TABLE Tickets;`,
            [],
            () => { console.log('Table event_registration a ete supprimée avec succès') },
            (error: any) => { console.log('Erreur lors de la création de la table Users', error) }
        );
    });
};




export const loginUserWithPartner = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            // Faire une jointure entre Users et Partner pour obtenir toutes les informations
            tx.executeSql(
                `SELECT Users.*, Partners.phone, Partners.id as partner_id,  Partners.role, Partners.mobile, Partners.address
                FROM Users 
                LEFT JOIN Partners ON Users.id = Partners.user_id 
                WHERE Users.email = ? AND Users.password = ?;`,
                [email, password],
                (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                        let user = results.rows.item(0); // Récupérer les informations de l'utilisateur et du partenaire
                        resolve(user); // Renvoie toutes les informations (utilisateur + partenaire)
                    } else {
                        reject('Email ou mot de passe incorrect');
                    }
                },
                (error: any) => {
                    reject('Erreur lors de la connexion: ' + error.message);
                }
            );
        });
    });
};


export const createUserWithPartner = (id: number, name: string, email: string, password: string, phone: string, role: string, mobile: string, address: string, partner_id: number) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            // Vérifier si l'email existe déjà
            tx.executeSql(
                'SELECT * FROM Users WHERE email = ?;',
                [email],
                (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                        reject('Cet email est déjà utilisé.');
                    } else {
                        // Insérer un nouvel utilisateur dans la table Users
                        tx.executeSql(
                            'INSERT INTO Users (id, name, email, password) VALUES (?, ?, ?, ?);',
                            [id, name, email, password],
                            (tx: any, userResults: any) => {
                                const userId = userResults.insertId; // Récupérer l'ID de l'utilisateur inséré

                                // Insérer un enregistrement dans la table Partner en utilisant l'userId
                                tx.executeSql(
                                    'INSERT INTO Partners (id, phone, role, mobile, address, user_id) VALUES (?,?, ?, ?, ?, ?);',
                                    [partner_id, phone, role, mobile, address, userId],
                                    (tx: any, partnerResults: any) => {
                                        const id = partnerResults.insertId;
                                        resolve({ message: 'Utilisateur et partenaire créés avec succès', data: { phone, role, mobile, address, name, email, password, id, user_id: userId } });
                                    },
                                    (error: any) => {
                                        reject('Erreur lors de la création du partenaire: ' + error.message);
                                    }
                                );
                            },
                            (error: any) => {
                                reject('Erreur lors de la création de l’utilisateur: ' + error.message);
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

export function CreateRequest(categoryId: any, author_id: any, partnerId: any, typeId: any, text: any, company_id: any) {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `INSERT INTO requests (
                                         activation_date, category_id, date_assigned, 
                                        date_closed, date_created, deadline_state, impact, 
                                        name, partner_id, priority, request_text, 
                                        stage_name, start_date, type_id, urgency, isLocal, author_id, company_id)
                                    VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)`,
                [
                    moment().format("YYYY-MM-DD"),
                    categoryId || 0,
                    "",
                    "",
                    moment().format("YYYY-MM-DD HH:mm:ss"),
                    "",
                    "",
                    "",
                    partnerId || 0,
                    "3",
                    text || "",
                    "New", // On utilise le nom du stage
                    "",
                    typeId || 0,
                    "",
                    1, // Défaut à TRUE si non défini
                    author_id,
                    company_id,
                ],
                (tx: any, userResults: any) => {
                    resolve({ message: 'Utilisateur et partenaire créés avec succès', data: { userResults }, success: true });
                },
                (error: any) => {
                    reject('Erreur lors de la création de l’utilisateur: ' + error.message);
                }
            );

        });
    });

}
export function syncAllRequests(requests: any) {
    return new Promise((resolve, reject) => {
        db.transaction(function (tx: any) {
            let queryPromises = requests.map((request: any) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    // Mappage des champs imbriqués
                    const categoryId = request.category_id ? request.category_id.id : null;
                    const partnerId = request.partner_id ? request.partner_id.id : null;
                    const typeId = request.type_id ? request.type_id.id : null;

                    // Requête pour vérifier si l'ID existe déjà
                    tx.executeSql(
                        'SELECT id FROM requests WHERE id = ?',
                        [request.id],
                        function (tx: any, results: any) {
                            if (results.rows.length > 0) {
                                // L'ID existe déjà, on met à jour
                                tx.executeSql(
                                    `UPDATE requests 
                                    SET 
                                        activation_date = ?, 
                                        category_id = ?, 
                                        date_assigned = ?, 
                                        date_closed = ?, 
                                        date_created = ?, 
                                        deadline_state = ?, 
                                        impact = ?, 
                                        name = ?, 
                                        partner_id = ?, 
                                        priority = ?, 
                                        request_text = ?, 
                                        stage_name = ?, 
                                        start_date = ?, 
                                        type_id = ?, 
                                        urgency = ?, 
                                        isLocal = ? ,
                                        author_id = ?
                                    WHERE id = ?`,
                                    [
                                        request.activation_date || "",
                                        categoryId || 0,
                                        request.date_assigned || "",
                                        request.date_closed || "",
                                        request.date_created || "",
                                        request.deadline_state || "",
                                        request.impact || "",
                                        request.name || "",
                                        partnerId || 0,
                                        request.priority || "",
                                        request.request_text || "",
                                        request.stage_id?.name || "", // On utilise le nom du stage
                                        request.start_date || "",
                                        typeId || 0,
                                        request.urgency || "",
                                        0, // Défaut à TRUE si non défini
                                        request.author_id?.id || 0,
                                        request.id,
                                    ],
                                    () => resolveQuery('Updated: ' + request.id), // Réussite de la mise à jour
                                    (tx: any, error: any) => rejectQuery('Update failed: ' + request.id + ' ' + error.message) // Échec de la mise à jour
                                );
                            } else {
                                // L'ID n'existe pas, on insère un nouveau record
                                tx.executeSql(
                                    `INSERT INTO requests (
                                        id, activation_date, category_id, date_assigned, 
                                        date_closed, date_created, deadline_state, impact, 
                                        name, partner_id, priority, request_text, 
                                        stage_name, start_date, type_id, urgency, isLocal,author_id)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
                                    [
                                        request.id,
                                        request.activation_date || "",
                                        categoryId || 0,
                                        request.date_assigned || "",
                                        request.date_closed || "",
                                        request.date_created || "",
                                        request.deadline_state || "",
                                        request.impact || "",
                                        request.name || "",
                                        partnerId || 0,
                                        request.priority || "3",
                                        request.request_text || "",
                                        request.stage_id.name || "", // On utilise le nom du stage
                                        request.start_date || "",
                                        typeId || 0,
                                        request.urgency || "",
                                        0,
                                        request.author_id?.id || 0, // Défaut à TRUE si non défini
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
export function syncAllCategorys(requests: any) {
    return new Promise((resolve, reject) => {
        db.transaction(function (tx: any) {
            let queryPromises = requests.map((request: any) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT id FROM Categorys WHERE id = ?',
                        [request.id],
                        function (tx: any, results: any) {
                            if (results.rows.length > 0) {
                                resolveQuery('Inserted: ' + request.id);

                            } else {
                                // L'ID n'existe pas, on insère un nouveau record
                                tx.executeSql(
                                    `INSERT INTO Categorys (
                                        id, name) 
                                    VALUES (?, ?)`,
                                    [
                                        request.id,
                                        request.name,
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
export function syncAllType(requests: any) {
    return new Promise((resolve, reject) => {
        db.transaction(function (tx: any) {
            let queryPromises = requests.map((request: any) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT id FROM Types WHERE id = ?',
                        [request.id],
                        function (tx: any, results: any) {
                            if (results.rows.length > 0) {
                                resolveQuery('Inserted: ' + request.id);
                            } else {
                                // L'ID n'existe pas, on insère un nouveau record
                                tx.executeSql(
                                    `INSERT INTO Types (
                                        id, name, category_id)
                                    VALUES (?, ?, ?)`,
                                    [
                                        request.id,
                                        request.name,
                                        request.category_ids?.[0]?.id || 0,
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
export function syncAllCompanys(requests: any) {
    return new Promise((resolve, reject) => {
        db.transaction(function (tx: any) {
            let queryPromises = requests.map((request: any) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT id FROM Companys WHERE id = ?',
                        [request.id],
                        function (tx: any, results: any) {
                            if (results.rows.length > 0) {
                                resolveQuery('Inserted: ' + request.id);
                            } else {
                                // L'ID n'existe pas, on insère un nouveau record
                                tx.executeSql(
                                    `INSERT INTO Companys (
                                        id, name)
                                    VALUES (?, ?)`,
                                    [
                                        request.id,
                                        request.name,
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
export function syncAllPartners(requests: any) {
    return new Promise((resolve, reject) => {
        db.transaction(function (tx: any) {
            let queryPromises = requests.map((request: any) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT id FROM Partner WHERE id = ?',
                        [request.id],
                        function (tx: any, results: any) {
                            if (results.rows.length > 0) {
                                resolveQuery('Inserted: ' + request.id);
                            } else {
                                // L'ID n'existe pas, on insère un nouveau record
                                tx.executeSql(
                                    `INSERT INTO Partner (
                                        id, name, rfid_code, image_128)
                                    VALUES (?, ?, ?, ?)`,
                                    [
                                        request.id,
                                        request.name,
                                        request.rfid_code,
                                        request.image_128,
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
export const getResquestData = (tableName: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT requests.*,
                    Categorys.name AS category_name,
                    Types.name AS type_name
                FROM requests
                LEFT JOIN Categorys ON requests.category_id = Categorys.id
                LEFT JOIN Types ON requests.type_id = Types.id;
                ;`,
                [],
                (tx: any, results: any) => {
                    let users = [];
                    let len = results.rows.length;
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            let user = results.rows.item(i);
                            users.push(user);  // Ajouter l'utilisateur au tableau
                        }
                    }
                    resolve(({ data: users, success: true }));  // Résoudre la promesse avec le tableau d'utilisateurs
                },
                (error: any) => {
                    resolve({ ...error, success: false });  // Rejeter la promesse en cas d'erreur
                }
            );
        });
    });
};

export const getTypesByCategory = (categoryId: number) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT types.*
                    FROM types
                    WHERE types.category_id = ?;`,
                [categoryId], // Passe l'ID de la catégorie ici
                (tx: any, results: any) => {
                    let types = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        types.push(results.rows.item(i));
                    }
                    resolve(({ data: types, success: true }));  // Résoudre la promesse avec le tableau d'utilisateurs
                },
                (error: any) => {
                    resolve({ ...error, success: false });  // Rejeter la promesse en cas d'erreur
                }
            );
        });
    });
};
export const deleteLocalRequest = (id: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `DELETE FROM requests WHERE id = ?;`,
                [id],
                () => resolve({ data: 'types', success: true }), // Résoudre si la suppression réussit
                (tx: any, error: any) => resolve({ ...error, success: false })
            );
        });
    });
};
export const getUnSyncRequest = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM requests WHERE isLocal = 1;`,
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
export const getPartnerRequest = (author_id: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT requests.*,
                Categorys.name AS category_name,
                Types.name AS type_name
                FROM requests
                LEFT JOIN Categorys ON requests.category_id = Categorys.id
                LEFT JOIN Types ON requests.type_id = Types.id
             WHERE author_id = ?;`,
                [author_id],
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




















export const insertEvent = (eventData: any) => {
    const {
        id, name, badge_format, badge_image, community_menu, cover_properties,
        create_date, date_begin, date_end, date_tz, description, introduction_menu,
        is_published, kanban_state, kanban_state_label, lang, location_menu, menu_register_cta,
        note, seats_limited, seats_max, write_date, address_id, country_id, organizer_id, registration_ids, stage_id
    } = eventData;

    const address = address_id[0]?.name || '';
    const country = country_id[0]?.name || '';
    const stage = stage_id[0]?.name || '';
    const organizer = organizer_id[0]?.id || null;
    const attendees = registration_ids?.length || 0;
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {

            tx.executeSql(
                'SELECT * FROM Events WHERE id = ?;',
                [id],
                (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                        tx.executeSql(
                            `UPDATE Events SET attendees = ? WHERE id = ?;`,
                            [attendees, id],
                            (tx: any, results: any) => {
                                if (results.rowsAffected > 0) {
                                    resolve({ success: true, message: 'Enregistrement mis à jour avec succès.' });
                                } else {
                                    resolve({ success: false, message: 'Aucun enregistrement trouvé avec ce code-barres.' });
                                }
                            },
                            (error: any) => {
                                resolve({ success: false, message: 'Erreur lors de la mise à jour de l\'enregistrement.', error });
                            }
                        );
                    } else {
                        tx.executeSql(
                            `INSERT INTO Events (
                                id, name, badge_format, badge_image, community_menu, cover_properties,
                                    create_date, date_begin, date_end, date_tz, description, introduction_menu,
                                    is_published, kanban_state, kanban_state_label, lang, location_menu, 
                                    menu_register_cta, note, seats_limited, seats_max, attendees, write_date, address,
                                    country, stage,organizer_id
                                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?);`,
                            [
                                id, name, badge_format, badge_image, community_menu, cover_properties,
                                create_date, date_begin, date_end, date_tz, description, introduction_menu,
                                is_published, kanban_state, kanban_state_label, lang, location_menu,
                                menu_register_cta, note, seats_limited, seats_max, attendees, write_date, address,
                                country, stage, organizer
                            ],
                            (tx: any, results: any) => {
                                resolve({ message: 'Utilisateur et partenaire créés avec succès', success: true, results });
                            },
                            (error: any) => {
                                resolve({ message: 'Utilisateur et partenaire créés avec succès', success: false, ...error });
                            }
                        );
                    }
                });
        });
    })
};


export const insertEventRegistration = (data: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            data.forEach((item: any) => {


                tx.executeSql(
                    'SELECT * FROM event_registration WHERE id = ?;',
                    [item.id],
                    (tx: any, results: any) => {
                        if (results.rows.length > 0) {
                            // console.log("element existant");

                            // reject({ message: 'Ce event_registration  Existe deja.', success: false, data: results.rows?.item(0) });
                        } else {
                            tx.executeSql(
                                `INSERT INTO event_registration 
                        (id, name, active, barcode, email, phone, state, event_ticket_id, create_date, write_date, event_id, ticket, urlDownload)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`,
                                [
                                    item.id,
                                    item.name,
                                    item.active || true,  // Conversion du booléen en 0 ou 1
                                    item.barcode,
                                    item.email,
                                    item.phone,
                                    item.state,
                                    item.event_ticket_id?.id || null,  // Extraction de l'ID du billet
                                    item.date,
                                    item.date,
                                    item.event?.id || null,
                                    item.ticket,
                                    item.urlDownload,
                                ],
                                (tx: any, result: any) => {
                                    console.log('Data inserted successfully: ', result);
                                },
                                (error: any) => {
                                    // console.log('Error inserting data: ', error);
                                    reject(error);
                                }
                            );
                        }
                    })
            });
        },
            (error: any) => {
                // console.log('Transaction error: ', error);
                reject(error);
            },
            () => {
                // console.log('Transaction complete');
                resolve('Transaction complete');
            });
    });
};

export const insertTicket = (data: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            data.forEach((item: any) => {

                tx.executeSql(
                    'SELECT * FROM Tickets WHERE id = ?;',
                    [item.id],
                    (tx: any, results: any) => {
                        if (results.rows.length > 0) {
                            // console.log("element existant");

                            // reject({ message: 'Ce event_registration  Existe deja.', success: false, data: results.rows?.item(0) });
                        } else {
                            tx.executeSql(
                                `INSERT INTO Tickets
                        (id, name, create_date, color, event_id)
                        VALUES (?, ?, ?, ?, ?)`,
                                [
                                    item.id,
                                    item.name,
                                    item.create_date,  // Conversion du booléen en 0 ou 1
                                    item.color,
                                    item.event_id?.[0]?.id,
                                ],
                                (tx: any, result: any) => {
                                    console.log('Data inserted successfully: ', result);
                                },
                                (error: any) => {
                                    console.log('Error inserting data: ', error);
                                    reject(error);
                                }
                            );
                        }
                    })
            });
        },
            (error: any) => {
                // console.log('Tickets-Transaction error: ', error);
                reject(error);
            },
            () => {
                // console.log('Transaction complete');
                resolve('Tickets-Transaction complete');
            });
    });
};

export const createPartner = (user: any) => {
    const { id, name, email, password, phone, role, mobile, address, partner_id } = user

    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            // Vérifier si l'email existe déjà
            tx.executeSql(
                'SELECT * FROM Partners WHERE id = ?;',
                [partner_id],
                (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                        reject({ message: 'Ce Partners  Existe deja.', success: false, data: results.rows?.item(0) });
                    } else {
                        // Insérer un nouvel utilisateur dans la table Users
                        if (id) {
                            tx.executeSql(
                                'INSERT INTO Users (id, name, email, password) VALUES (?, ?, ?, ?);',
                                [id, name, email, password],
                                (tx: any, userResults: any) => {
                                    const userId = userResults.insertId; // Récupérer l'ID de l'utilisateur inséré

                                    // Insérer un enregistrement dans la table Partner en utilisant l'userId
                                    tx.executeSql(
                                        'INSERT INTO Partners (id, phone, role, mobile, address, user_id) VALUES (?, ?, ?, ?, ?, ?);',
                                        [partner_id, phone, role, mobile, address, userId],
                                        () => {
                                            resolve('Utilisateur et partenaire créés avec succès');
                                        },
                                        (error: any) => {
                                            reject('Erreur lors de la création du partenaire: ' + error.message);
                                        }
                                    );
                                },
                                (error: any) => {
                                    reject('Erreur lors de la création de l’utilisateur: ' + error.message);
                                }
                            );
                        } else {
                            tx.executeSql(
                                'INSERT INTO Users (name, email, password) VALUES (?, ?, ?);',
                                [name, email, password],
                                (tx: any, userResults: any) => {
                                    const userId = userResults.insertId; // Récupérer l'ID de l'utilisateur inséré

                                    // Insérer un enregistrement dans la table Partner en utilisant l'userId
                                    tx.executeSql(
                                        'INSERT INTO Partners (id, phone, role, mobile, address, user_id) VALUES (?, ?, ?, ?, ?, ?);',
                                        [partner_id, phone, role, mobile, address, userId],
                                        () => {
                                            resolve('Utilisateur et partenaire créés avec succès');
                                        },
                                        (error: any) => {
                                            reject('Erreur lors de la création du partenaire: ' + error.message);
                                        }
                                    );
                                },
                                (error: any) => {
                                    reject('Erreur lors de la création de l’utilisateur: ' + error.message);
                                }
                            );
                        }

                    }
                },
                (error: any) => {
                    reject('Erreur lors de la vérification de l’email: ' + error.message);
                }
            );
        });
    });
};


export const getdata = (tableName: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM ${tableName};`,
                [],
                (tx: any, results: any) => {
                    let users = [];
                    let len = results.rows.length;
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            let user = results.rows.item(i);
                            users.push(user);  // Ajouter l'utilisateur au tableau
                        }
                    }
                    resolve(({ data: users, success: true }));  // Résoudre la promesse avec le tableau d'utilisateurs
                },
                (error: any) => {
                    resolve({ ...error, success: false });  // Rejeter la promesse en cas d'erreur
                }
            );
        });
    });
};


export const getEventRegistrationData = (event_id: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM event_registration WHERE event_id=? ;`,
                [event_id],
                (tx: any, results: any) => {
                    let users = [];
                    let len = results.rows.length;
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            let user = results.rows.item(i);
                            users.push(user);
                        }
                    }
                    resolve(({ data: users, success: true }));
                },
                (error: any) => {
                    resolve({ ...error, success: false });
                }
            );
        });
    });
};
export const getEventTiketData = (event_id: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM Tickets  WHERE event_id=?;`,
                [event_id],
                (tx: any, results: any) => {
                    let users = [];
                    let len = results.rows.length;
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            let user = results.rows.item(i);
                            users.push(user);
                        }
                    }
                    resolve(({ data: users, success: true }));
                },
                (error: any) => {
                    resolve({ ...error, success: false });
                }
            );
        });
    });
};
export const getEventRegistrationByQRCode = (qrcode: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM event_registration WHERE barcode = ?;;`,
                [qrcode],
                (tx: any, results: any) => {
                    let users = [];
                    let len = results.rows.length;
                    if (len > 0) {
                        for (let i = 0; i < len; i++) {
                            let user = results.rows.item(i);
                            users.push(user);
                        }
                    }
                    resolve(({ data: users, success: true }));
                },
                (error: any) => {
                    resolve({ ...error, success: false });
                }
            );
        });
    });
};
export const updateEventRegistration = (id: any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `UPDATE event_registration SET state = ? WHERE id = ?;`,
                ['done', id],
                (tx: any, results: any) => {
                    if (results.rowsAffected > 0) {
                        resolve({ success: true, message: 'Enregistrement mis à jour avec succès.' });
                    } else {
                        resolve({ success: false, message: 'Aucun enregistrement trouvé avec ce code-barres.' });
                    }
                },
                (error: any) => {
                    resolve({ success: false, message: 'Erreur lors de la mise à jour de l\'enregistrement.', error });
                }
            );
        });
    });
};
