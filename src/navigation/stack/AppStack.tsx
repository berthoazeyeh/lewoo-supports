import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';
import { DARK_MODE, PRIMARY, showCustomMessage } from 'utils';
import AuthStacks from 'navigation/auth';
import AppStacks from 'navigation/app';
import { useEffect } from 'react';
import { updateBannerMessage, updateSynchronisationDOWNStateStored, updateSynchronisationUPStateStored, updateSyncing, useCurrentSynchronisedStateDown, useCurrentSynchronisedStateUp } from 'store';
import { deleteLocalRequest, getData, getUnSyncRequest, LOCAL_URL, postData, syncAllCategorys, syncAllCompanys, syncAllPartners, syncAllRequests, syncAllType } from 'apis';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';


export type AppStackStackList = {
  AppStacks: undefined;
  AuthStacks: undefined;

};

const Stack = createStackNavigator<AppStackStackList>();

export function AppStack() {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useDispatch()
  const SynchronisedStateDown = useCurrentSynchronisedStateDown();
  const SynchronisedStateUp = useCurrentSynchronisedStateUp();
  const { data, error: typeError, isLoading: isLoadingType } = useSWR(`${LOCAL_URL}/api/support/requests`,
    getData,
    {
      refreshInterval: 100000,
      refreshWhenHidden: true,
    },
  );
  const { trigger: createNewTicket } = useSWRMutation(`${LOCAL_URL}/api/support/crud/request`, postData)
  useEffect(() => {
    synData();
  }, [])
  useEffect(() => {
    if (data) {
      syncRequest();
    }
  }, [data, SynchronisedStateDown])
  useEffect(() => {
    if (SynchronisedStateUp) {
      console.log("????????????????????????????????????????????????????");
      synServerDataData();
      console.log("????????????????????????????????????????????????????");
    }
  }, [SynchronisedStateUp])

  const synData = async () => {
    try {
      dispatch(updateSyncing(true));
      dispatch(updateBannerMessage("Demarage de la synchronitions des Catetegories, Compagnies et des types "));
      await getCategory();
      await getCategoryCat();
      await getCompany()
      // await getpartners()
      const data: any = await getUnSyncRequest();
      if (data && data.data && data.data.length > 0) {
        console.log("getUnSyncRequest@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", data.data);
        dispatch(updateSynchronisationUPStateStored(true));
      }
      dispatch(updateSyncing(false));
    } catch (error) {

    }
  }

  const synServerDataData = async () => {
    try {
      dispatch(updateSyncing(true));


      const data: any = await getUnSyncRequest();
      if (data && data.data && data.data.length > 0) {
        console.log("getUnSyncRequest", data.data.length);
        await insertMultipleRequests(data.data);
        dispatch(updateSynchronisationUPStateStored(false));
        dispatch(updateSynchronisationUPStateStored(true));
        dispatch(updateSynchronisationDOWNStateStored(true));
      }
      dispatch(updateSyncing(false));
    } catch (error) {

    }
  }


  const syncRequest = async () => {
    dispatch(updateSyncing(true));
    dispatch(updateBannerMessage("Demarage de la synchronitions des tickets "));

    await getRequests();
    dispatch(updateSyncing(false));
  }

  const getRequests = async (): Promise<void> => {
    dispatch(updateBannerMessage("synchronitions des tickets en cours  "));

    return new Promise(async (resolve, reject) => {
      try {
        if (data && data?.success) {
          const data1 = data?.success ? data?.data : [];
          syncAllRequests(data1)
            .then((d: any) => {
              console.log("getRequests================", d.length);
              dispatch(updateBannerMessage("La synchronisation de Requests a reussi"));

              showCustomMessage("Information", "La synchronisation de Requests a reussi", "success", "center");
              resolve();
            })
            .catch((err) => {
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
  const getCategory = async (): Promise<void> => {
    dispatch(updateSyncing(true));
    dispatch(updateBannerMessage("La synchronisation des category est en cours"));

    return new Promise(async (resolve, reject) => {
      try {
        const res = await getData(`${LOCAL_URL}/api/request.category/search`);
        if (res?.success) {
          const data = res?.success ? res?.data : [];
          syncAllCategorys(data)
            .then((d: any) => {
              console.log("cat================", d.length);
              dispatch(updateBannerMessage("La synchronisation de category a reussi"));

              showCustomMessage("Information", "La synchronisation de category a reussi", "success", "center");
              resolve();
            })
            .catch((err) => {
              showCustomMessage("Information", "La synchronisation de category a échoué", "warning", "bottom");
              resolve(err);
            });
        } else {
          showCustomMessage("Information", res.message, "warning", "bottom");
          resolve();
        }
      } catch (err: any) {
        showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom");
        console.error('Une erreur s\'est produite :', err);
        resolve(err);
      }
    });
  };

  const getCategoryCat = async (): Promise<void> => {
    dispatch(updateSyncing(true));
    dispatch(updateBannerMessage("La synchronisation des category type en cours"));

    return new Promise(async (resolve, reject) => {
      try {
        const res = await getData(`${LOCAL_URL}/api/request.type/search`);
        if (res?.success) {
          const data = res?.success ? res?.data : [];
          syncAllType(data)
            .then((d: any) => {
              console.log("type================", d.length);
              // showCustomMessage("Information", "La synchronisation de Types a reussi", "success", "center");

              dispatch(updateBannerMessage("La synchronisation de Types a reussi"));
              resolve(); // La promesse est résolue ici
            })
            .catch((err) => {
              showCustomMessage("Information", "La synchronisation de Types a échoué", "warning", "bottom");
              resolve(err); // La promesse est rejetée ici
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




  const getCompany = async (): Promise<void> => {
    dispatch(updateSyncing(true));
    dispatch(updateBannerMessage("La synchronisation des companys est en cours"));

    return new Promise(async (resolve, reject) => {
      try {
        const res = await getData(`${LOCAL_URL}/api/res.company/search?fields=['name']`);
        if (res?.success) {
          const data = res?.success ? res?.data : [];

          syncAllCompanys(data)
            .then((d: any) => {
              console.log("tCompanyype================", d.length);
              // showCustomMessage("Information", "La synchronisation de Types a reussi", "success", "center");
              dispatch(updateBannerMessage("La synchronisation de companys a reussi"));

              resolve(); // La promesse est résolue ici
            })
            .catch((err) => {
              showCustomMessage("Information", "La synchronisation de Types a échoué", "warning", "bottom");
              resolve(err); // La promesse est rejetée ici
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
  const getpartners = async (): Promise<void> => {
    dispatch(updateSyncing(true));
    dispatch(updateBannerMessage("La synchronisation des Partners est en cours"));

    return new Promise(async (resolve, reject) => {
      try {
        const res = await getData(`${LOCAL_URL}/api/res.partner/search?fields=['name','rfid_code', 'image_128']`);
        if (res?.success) {
          const data = res?.success ? res?.data : [];
          console.log("partners================", data.length);
          dispatch(updateBannerMessage("La synchronisation des Partners est en cours"));

          syncAllPartners(data)
            .then((d: any) => {
              console.log("partners================", data.length);
              dispatch(updateBannerMessage("La synchronisation de companys a reussi"));

              // showCustomMessage("Information", "La synchronisation de Partner(client) a reussi", "success", "center");
              resolve(); // La promesse est résolue ici
            })
            .catch((err) => {
              showCustomMessage("Information", "La synchronisation de Types a échoué", "warning", "bottom");
              resolve(err); // La promesse est rejetée ici
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
  const insertMultipleRequests = async (dataList: any[],) => {
    dispatch(updateBannerMessage("Demarage de d'insertion sur le serveurs "));
    return new Promise(async (resolve, reject) => {
      let total = dataList.length;
      let completed = 0;

      for (let i = 0; i < total; i++) {
        const dataSup = {
          category_id: dataList[i].category_id,
          type_id: dataList[i].type_id,
          request_text: dataList[i].request_text,
          partner_id: dataList[i].partner_id,
          author_id: dataList[i].author_id,
          company_id: dataList[i].company_id,
        };

        try {
          const res = await createNewTicket(dataSup);
          if (res.success) {
            await deleteLocalRequest(dataList[i].id);
            completed++;
            console.log(`Insertion ${completed}/${total}`);
            showCustomMessage("Progress", `Insertion ${completed}/${total}`, "info", "center");
            dispatch(updateBannerMessage(`Progress Insertion ${completed}/${total}`));
            // Check if all requests are inserted
            if (completed === total) {
              console.log("All requests inserted");
              resolve("All requests inserted");
            }
          } else {
            showCustomMessage("Information", res?.message, "warning", "bottom");
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
    <Stack.Navigator
      initialRouteName='AuthStacks'
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: isDarkMode ? DARK_MODE : "white",
        },
        headerTintColor: isDarkMode ? "white" : PRIMARY,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >

      <Stack.Screen

        name="AuthStacks"

        component={AuthStacks} />
      <Stack.Screen

        name="AppStacks"

        component={AppStacks} />


    </Stack.Navigator>
  );
}
