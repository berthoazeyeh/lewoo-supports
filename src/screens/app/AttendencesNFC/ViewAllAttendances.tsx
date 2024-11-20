import { useFocusEffect } from '@react-navigation/native';
import { getAllAttendances } from 'apis/databaseAttend';
import moment from 'moment';
import * as React from 'react';
import { ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import { useSynAttendencesStateDown, useTheme } from 'store';
import { Theme } from 'utils';

const ViewAllAttendances = (props: any) => {
    const [page, setPage] = React.useState<number>(0);
    const [numberOfItemsPerPageList] = React.useState([10, 50, 100]);
    const [attendances, setAttendances] = React.useState([]);
    const theme = useTheme();
    const synDown = useSynAttendencesStateDown();

    const [itemsPerPage, onItemsPerPageChange] = React.useState(
        numberOfItemsPerPageList[0]
    );
    const getLocalData = async () => {

        const data: any = await getAllAttendances();

        // console.log(data);

        if (data.success) {
            setAttendances((data.data));
        }
    }
    React.useLayoutEffect(() => {
        props.navigation.setOptions({
            title: 'Liste des presences',

        });
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            getLocalData();
            setInterval(() => {
                getLocalData();
            }, 5000)
            return () => {
                // interval.unref()
            };
        }, [synDown])
    );


    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, attendances.length);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    return (
        <ScrollView horizontal>
            <ScrollView>
                <DataTable >
                    <DataTable.Header >
                        <DataTable.Title sortDirection='descending' style={{ width: 150, }} textStyle={{ color: theme.primaryText, ...Theme.fontStyle.montserrat.bold }}>Nom & prenom</DataTable.Title>
                        <DataTable.Title sortDirection='descending' style={{ width: 150, marginHorizontal: 20, alignItems: "center", }}>checkin Time</DataTable.Title>
                        <DataTable.Title sortDirection='descending' style={{ width: 150 }} >checkout Time</DataTable.Title>
                        <DataTable.Title sortDirection='descending' style={{ width: 150 }} >Is Local</DataTable.Title>
                        <DataTable.Title sortDirection='descending' style={{ width: 200 }} >Auteur</DataTable.Title>
                    </DataTable.Header>
                    {attendances.slice(from, to).map((item: any, index) => (
                        <DataTable.Row key={index}>
                            <DataTable.Cell centered style={{ width: 150 }} textStyle={{ color: theme.primaryText, ...Theme.fontStyle.montserrat.bold }}>{item.user_name}</DataTable.Cell>
                            <DataTable.Cell centered={true} style={{ width: 150, marginHorizontal: 20, alignItems: "center" }}>{item.checkin_time && moment(item.checkin_time).format("L HH:mm:ss")}</DataTable.Cell>
                            <DataTable.Cell style={{ width: 150 }}>{item.checkout_time && moment(item.checkout_time).format("L HH:mm:ss")}</DataTable.Cell>
                            <DataTable.Cell style={{ width: 150 }}>{item.isLocal === 0 ? "False" : "True"}</DataTable.Cell>
                            <DataTable.Cell style={{ width: 200, }}>{item.make_attendance_id ? item.make_attendance_id : ""} {item.longitude ? ` - ${item.longitude}:${item.latitude}` : ""}</DataTable.Cell>
                        </DataTable.Row>
                    ))}

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(attendances.length / itemsPerPage)}
                        onPageChange={(page) => setPage(page)}
                        label={`${from + 1}-${to} of ${attendances.length}`}
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        showFastPaginationControls
                        selectPageDropdownLabel={'Rows per page'}
                    />
                </DataTable>
            </ScrollView>
        </ScrollView>
    );
};

export default ViewAllAttendances;