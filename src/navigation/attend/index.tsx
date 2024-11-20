import { createStackNavigator } from '@react-navigation/stack'
import { getDataAS, LOCAL_URL1, postData, postData1 } from 'apis';
import { deleteAttententLogs, getUnSyncAttendance, getUnSyncAttendanceLogs, syncAllPartners, updateAttententLocal, upsertAttendance } from 'apis/databaseAttend';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AttendencesNFC, LoginScreen2, MakeManuelAttendences, SignInScreen, ViewAllAttendances, WelcomeScreen } from 'screens';
import { updateAttendencesBannerMessage, updateStoredtTiming, updateSynAttendencesDOWN, updateSynAttendencesUP, updateSyncingAttendences, useSynAttendencesStateDown, useSynAttendencesStateUp, useIsAllReadySyncing, updateIsSyncing } from 'store';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { showCustomMessage } from 'utils';

export type AttendencesList = {
    Attendences: undefined;
    ViewAllAttendances: undefined;
    LoginScreen2: undefined;
    MakeManuelAttendences: undefined;
};
const Attendences = createStackNavigator<AttendencesList>()

const AttendencesStack = () => {
    const dispatch = useDispatch()
    const synDown = useSynAttendencesStateDown();
    const synUp = useSynAttendencesStateUp();
    const isAlreadySyncing = useIsAllReadySyncing();
    const { trigger: createNewAttedences } = useSWRMutation(`${LOCAL_URL1}/api/crud/attendance`, postData1)
    const { trigger: createNewAttedencesLog } = useSWRMutation(`${LOCAL_URL1}/api/crud/attendance-log`, postData1)
    console.log("isAlreadySyncing.......0", isAlreadySyncing)

    const { data, error: typeError, isLoading: isLoadingType } = useSWR(`${LOCAL_URL1}/api/hr.employee/search?fields=['name','rfid_code', 'image_1920']`,
        getDataAS,
        {
            refreshInterval: 1000000,
            refreshWhenHidden: true,
        },
    );
    const { data: time, error: typeError1, isLoading: isLoadingType1 } = useSWR(`${LOCAL_URL1}/api/attendance/params`, getDataAS,
        {
            refreshInterval: 10000,
            refreshWhenHidden: true,
        },
    );

    useEffect(() => {
        // console.log(".........", time);
        if (time) {
            if (time.success) {
                const number = parseInt(time.data.timing_badging);
                dispatch(updateStoredtTiming(number / 60));
            }
        }
    }, [time])

    const getLastAttendences = async (): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await getDataAS(`${LOCAL_URL1}/api/employees/attendances`);
                if (res?.success) {
                    const data = res?.success ? res?.data : [];
                    console.log("/////////////&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", data.length);
                    upsertAttendance(data).then(result => {
                        console.log(",,,,,,,,,,,,,,,,,,", result);
                        dispatch(updateAttendencesBannerMessage("La synchronisation de companys a reussi"));
                        resolve()
                    }).catch((error) => {
                        console.log("error,", error);
                        showCustomMessage("Information", "La synchronisation de Types a échoué", "warning", "bottom");

                    });

                } else {
                    showCustomMessage("Information", res.message, "warning", "bottom");
                    resolve(); // Rejeter si la requête n'a pas réussi
                }
            } catch (err: any) {
                showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom");
                console.error('Une erreur s\'est produite :', err);
                resolve(err); // Rejeter en cas d'erreur
            }
        });
    };


    const synServerDataData = async () => {
        try {
            console.log("demarage================================");
            dispatch(updateSynAttendencesUP(false));

            dispatch(updateSyncingAttendences(true));
            const data: any = await getUnSyncAttendance();
            console.log("isAlreadySyncing.......1", isAlreadySyncing)
            if (data && data.data && data.data.length > 0 && !isAlreadySyncing) {
                console.log("getUnSyncRequest---------------------#########", data.data.length);
                dispatch(updateIsSyncing(true))
                console.log("isAlreadySyncing........2", isAlreadySyncing)
                try {
                    await insertMultipleRequests(data.data);
                    // dispatch(updateSynAttendencesDOWN(false));
                    dispatch(updateIsSyncing(false))

                } catch (error) {
                    // dispatch(updateSynAttendencesUP(true));
                    dispatch(updateIsSyncing(false))

                } finally {
                    console.log("?????????????????????????");

                    dispatch(updateIsSyncing(false))
                }
            }
            console.log("isAlreadySyncing.........3", isAlreadySyncing)

            const dataLogs: any = await getUnSyncAttendanceLogs();
            if (dataLogs && dataLogs.data && dataLogs.data.length > 0) {
                console.log("/////////////////////////////", dataLogs.data.length);
                try {
                    const res = await insertMultipleAttendanceLogs(dataLogs.data);
                } catch (error) {
                }
            }

            dispatch(updateSyncingAttendences(false));
        } catch (error) {

        }
    }


    useEffect(() => {
        if (isLoadingType) {
            dispatch(updateSyncingAttendences(true));
        }

        if (data) {
            syncEmployee();
        }
    }, [data])
    useEffect(() => {
        console.log("----------------------------------");
        syncAttendence()
    }, [synDown])


    useEffect(() => {
        if (synUp) {
            console.log("----------------------------------");
            synServerDataData();
        }
    }, [synUp])

    const getEmployee = async (): Promise<void> => {
        dispatch(updateAttendencesBannerMessage("synchronitions des Employee en cours  "));

        return new Promise(async (resolve, reject) => {
            try {
                if (data && data?.success) {
                    const data1 = data?.success ? data?.data : [];
                    // console.log("getEmployee================", data1.length);
                    syncAllPartners(data1)
                        .then((d: any) => {
                            console.log("getEmployee================", d.length);
                            dispatch(updateAttendencesBannerMessage("La synchronisation de Employee a reussi"));

                            showCustomMessage("Information", "La synchronisation des Employees a reussi", "success", "center");
                            resolve();
                        })
                        .catch((err: any) => {
                            showCustomMessage("Information", "La synchronisation de Requests a échoué", "warning", "bottom");
                            resolve(err);
                        });
                } else {
                    showCustomMessage("Information", data.message, "warning", "bottom");
                    resolve();
                }
            } catch (err: any) {
                showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom");
                console.error('Une erreur s\'est produite :', err);
                resolve(err);
            }
        });
    };
    const syncEmployee = async () => {
        dispatch(updateSyncingAttendences(true));
        dispatch(updateAttendencesBannerMessage("Demarage de la synchronitions des Employee "));
        await getEmployee();
        const data: any = await getUnSyncAttendance();
        if (data && data.data && data.data.length > 0) {
            console.log("getUnSyncRequest@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", data.data.length);
            dispatch(updateSynAttendencesUP(true));
        }
        dispatch(updateSyncingAttendences(false));
    }
    const syncAttendence = async () => {
        dispatch(updateSyncingAttendences(true));
        dispatch(updateAttendencesBannerMessage("Demarage de la synchronitions des Attendences "));

        const data: any = await getUnSyncAttendance();
        if (data && data.data && data.data.length <= 0) {
            await getLastAttendences();
        } else {
            dispatch(updateSynAttendencesUP(true));

        }
        dispatch(updateSyncingAttendences(false));
        dispatch(updateSynAttendencesDOWN(false));
    }
    const insertMultipleRequests = async (dataList: any[],) => {
        dispatch(updateSyncingAttendences(true));

        dispatch(updateAttendencesBannerMessage("Demarage de d'insertion sur le serveurs "));
        return new Promise(async (resolve, reject) => {
            let total = dataList.length;
            let completed = 0;
            for (let i = 0; i < total; i++) {
                let dataSup: any = {
                    employee_id: dataList[i].id_user,
                    // check_time: moment(dataList[i].created_at).format("YYYY-MM-DD HH:mm:ss"),
                };
                if (dataList[i].checkin_time) {
                    dataSup['check_in'] = moment(dataList[i].checkin_time).format("YYYY-MM-DD HH:mm:ss");
                }
                if (dataList[i].checkout_time) {
                    dataSup['check_out'] = moment(dataList[i].checkout_time).format("YYYY-MM-DD HH:mm:ss");
                }
                if (dataList[i].make_attendance_id) {
                    dataSup['make_attendance_id'] = dataList[i].make_attendance_id;
                }
                if (dataList[i].longitude) {
                    dataSup['longitude'] = dataList[i].longitude;
                }
                if (dataList[i].latitude) {
                    dataSup['latitude'] = dataList[i].latitude;
                }
                console.log("........dataSup", dataSup, "..............", completed);

                try {
                    const res = await createNewAttedences(dataSup);
                    console.log("------------", res);

                    if (res.success) {
                        const upRes = await updateAttententLocal(dataList[i].id);
                        console.log("upRes----------------------", upRes);
                        completed++;
                        console.log(`Insertion ${completed}/${total}`);
                        dispatch(updateSyncingAttendences(true));

                        // showCustomMessage("Progress", `Insertion ${completed}/${total}`, "info", "center");
                        dispatch(updateAttendencesBannerMessage(`Progress Insertion ${completed}/${total}`));
                        if (completed === total) {
                            dispatch(updateSyncingAttendences(true));
                            console.log("All requests inserted");
                            resolve("All requests inserted");
                        }
                    } else {
                        if (res?.isExist) {
                            dispatch(updateAttendencesBannerMessage(`Progress Insertion ${completed}/${total}`));
                            const upRes = await updateAttententLocal(dataList[i].id);
                            console.log("upRes----------------------", upRes);
                        }
                        completed++;
                        if (completed === total) {
                            resolve("");



                        }
                        // showCustomMessage("Information", res?.message, "warning", "bottom");
                    }
                } catch (error: any) {
                    console.log("Error inserting request:", error);
                    showCustomMessage("Error", `Insertion failed at request ${i + 1}. status: ${error.status} statusText: ${error.statusText}`, "warning", "bottom");
                    dispatch(updateSyncingAttendences(false));

                    reject(error);
                    return;
                }
            }
        });
    };
    const insertMultipleAttendanceLogs = async (dataList: any[],) => {
        dispatch(updateSyncingAttendences(true));

        dispatch(updateAttendencesBannerMessage("Demarage de d'insertion sur le serveurs "));
        return new Promise(async (resolve, reject) => {
            let total = dataList.length;
            let completed = 0;
            for (let i = 0; i < total; i++) {
                let dataSup: any = {
                    rfid_code: dataList[i].rfid_code,
                    name: dataList[i].nom,
                    datetime: moment(dataList[i].datetime).format("YYYY-MM-DD HH:mm:ss"),
                    status: dataList[i].status,
                    activity_name: dataList[i].activity_name,
                    message: dataList[i].message,
                };
                try {
                    const res = await createNewAttedencesLog(dataSup);
                    if (res.success) {
                        const upRes = await deleteAttententLogs(dataList[i].id);
                        // console.log("upRes----------------------", upRes);
                        completed++;
                        console.log(`Insertion ${completed}/${total}`);
                        dispatch(updateSyncingAttendences(true));
                        dispatch(updateAttendencesBannerMessage(`Progress Insertion ${completed}/${total}`));
                        if (completed === total) {
                            dispatch(updateSyncingAttendences(true));
                            console.log("All requests inserted");
                            resolve("All requests inserted");
                        }
                    } else {
                        completed++;
                        console.log("----------=========--", res);
                        reject("error");

                        if (i === total) {
                            resolve("");
                        }
                    }
                } catch (error: any) {
                    console.log("Error inserting request:", error);
                    showCustomMessage("Error", `Insertion failed at request ${i + 1}. status: ${error.status} statusText: ${error.statusText}`, "warning", "bottom");
                    dispatch(updateSyncingAttendences(false));
                    reject(error);
                    return;
                }
            }
        });
    };

    return (
        <Attendences.Navigator
            screenOptions={{
                headerBackTitleVisible: false,
            }}
            initialRouteName="Attendences">
            <Attendences.Screen
                options={{ headerShown: false }}
                name="Attendences"
                component={AttendencesNFC}
            />
            <Attendences.Screen
                options={{ headerShown: true }}
                name="ViewAllAttendances"
                component={ViewAllAttendances}
            />
            <Attendences.Screen
                options={{ headerShown: false }}
                name="LoginScreen2"
                component={LoginScreen2}
            />
            <Attendences.Screen
                options={{ headerShown: true }}
                name="MakeManuelAttendences"
                component={MakeManuelAttendences}
            />
        </Attendences.Navigator>
    )
}



export default AttendencesStack
