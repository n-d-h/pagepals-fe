import { Box, Button, Grid, Pagination, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { getServiceByBookAndReader } from "../../../../services/apolo/queries";

import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Iconify from "../../../../components/iconify";
import { paths } from "../../../../components/router/paths";
import { selectUser } from "../../../../redux/slices/authSlice";
import ReaderServiceCard from "./ReaderServiceCard";

// print somthing
export default function ReaderBookServices() {
    const navigate = useNavigate();
    const userProfile = useSelector(selectUser);
    const bookId = useParams().id;
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const { data, loading, error, refetch } = useQuery(getServiceByBookAndReader, {
        variables: {
            id: bookId,
            readerId: _.get(userProfile, 'reader.id', ''),
            page: page,
            pageSize: 10,
            search: search,
        },
        fetchPolicy: 'no-cache',
    });

    const services = data?.getServicesByBook?.services || [];
    const serviceBook = services[0]?.book || {};
    const paging = data?.getServicesByBook?.paging || {};

    useEffect(() => {
        const timer = setTimeout(() => {
            refetch({
                id: bookId,
                readerId: _.get(userProfile, 'reader.id', ''),
                page: 0,
                pageSize: 10,
                search: search,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleChangeValueSearch = (e) => {
        setSearch(e.target.value);
    };


    if (error) {
        return <Typography>Something went wrong!</Typography>;
    }



    return (
        <Box sx={{ p: 2 }}>
            <Box
                sx={{ width: '100%' }}>
                <Typography variant="h5" mb={2} color={'GrayText'} textAlign={"start"} fontWeight={200}>List of services - {serviceBook?.title || "N/A"} ({paging?.totalOfElements || 0} active)</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%', gap: 5 }} >
                    <TextField
                        sx={{ width: '40%', borderRadius: 5, backgroundColor: 'white', height: '10%', marginBottom: 1 }}
                        // size="small"
                        placeholder="Search services..."
                        value={search}
                        onChange={handleChangeValueSearch}
                        InputProps={{
                            endAdornment: loading
                                ? (
                                    <Iconify icon="eos-icons:loading" />
                                )
                                : (
                                    <Iconify icon="bx:bx-search" />
                                ),
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 1, marginBottom: 1 }}
                        onClick={() => navigate(paths.main.createServiceWithOldBook(serviceBook?.externalId || '', serviceBook?.title || ''))}
                    >
                        Add service
                    </Button>

                </Box>
            </Box>
            <Box sx={{ height: 5 }}></Box>
            <Grid container spacing={2} direction="row">
                {services?.length > 0 && services.map((service) => (
                    <Grid item xs={12} lg={3} key={service.id}>
                        <ReaderServiceCard service={service} />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'center', my: 5 }}>
                        <Pagination
                            count={_.get(data, 'getServicesByBook.paging.totalOfPages', 1)}
                            page={page + 1}
                            onChange={(e, value) => setPage(value - 1)}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box >
    );
}