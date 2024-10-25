import { createStackNavigator } from '@react-navigation/stack'
import { getDataAS, LOCAL_URL1, postData, postData1 } from 'apis';
import { bulkInsertAttendance, getUnSyncAttendance, syncAllEmployee, syncAllPartners, updateAttententLocal, upsertAttendance } from 'apis/databaseAttend';
import moment from 'moment';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { AttendencesNFC, SignInScreen, WelcomeScreen } from 'screens';
import { updateAttendencesBannerMessage, updateSynAttendencesUP, updateSyncingAttendences, useSynAttendencesStateDown, useSynAttendencesStateUp } from 'store';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { showCustomMessage } from 'utils';

export type AttendencesList = {
    Attendences: undefined;
};
const Attendences = createStackNavigator<AttendencesList>()

const AttendencesStack = () => {
    const dispatch = useDispatch()
    const synDown = useSynAttendencesStateDown();
    const synUp = useSynAttendencesStateUp();
    const { trigger: createNewAttedences } = useSWRMutation(`${LOCAL_URL1}/api/crud/attendance`, postData1)

    const { data, error: typeError, isLoading: isLoadingType } = useSWR(`${LOCAL_URL1}/api/hr.employee/search?fields=['name','rfid_code', 'image_1920']`,
        getDataAS,
        {
            refreshInterval: 1000000,
            refreshWhenHidden: true,
        },
    );
    const getLastAttendences = async (): Promise<void> => {


        return new Promise(async (resolve, reject) => {
            try {
                const res = await getDataAS(`${LOCAL_URL1}/api/employees/attendances`);
                if (res?.success) {
                    const data = res?.success ? res?.data : [];
                    console.log("/////////////", data);
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
            dispatch(updateSyncingAttendences(true));
            const data: any = await getUnSyncAttendance();
            if (data && data.data && data.data.length > 0) {
                console.log("getUnSyncRequest---------------------#########", data.data.length);
                // await insertMultipleRequests(data.data);
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
        if (synUp) {
            synServerDataData();
        }
        console.log("----------------------------------");

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
        getLastAttendences()
        const data: any = await getUnSyncAttendance();
        if (data && data.data && data.data.length > 0) {
            console.log("getUnSyncRequest@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", data.data);
            dispatch(updateSynAttendencesUP(true));
        }
        dispatch(updateSyncingAttendences(false));
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
                    check_time: moment(dataList[i].created_at).format("YYYY-MM-DD HH:mm:ss"),
                };
                if (dataList[i].checkin_time) {
                    dataSup['check_in'] = moment(dataList[i].checkin_time).format("YYYY-MM-DD HH:mm:ss");
                } else {
                    dataSup['check_out'] = moment(dataList[i].checkout_time).format("YYYY-MM-DD HH:mm:ss");
                }
                console.log("........dataSup", dataSup);

                try {
                    const res = await createNewAttedences(dataSup);
                    console.log("------------", res);

                    if (res.success) {
                        await updateAttententLocal(dataList[i].id);
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
                        resolve("");
                        // showCustomMessage("Information", res?.message, "warning", "bottom");
                    }
                } catch (error) {
                    console.error("Error inserting request:", error);
                    showCustomMessage("Error", `Insertion failed at request ${i + 1}`, "warning", "bottom");
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


        </Attendences.Navigator>
    )
}



export default AttendencesStack
