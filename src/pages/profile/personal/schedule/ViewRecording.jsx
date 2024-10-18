import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import BackdropLoading from "../../../backdrop_loading/BackdropLoading";

function ViewRecording() {
    const { playUrl } = useParams();
    const zoomPlayUrl = `https://us06web.zoom.us/rec/play/${playUrl}`;
    const iframeRef = useRef();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(zoomPlayUrl);
    }, [loading]);

    const handleIframeLoad = () => {
        setLoading(false);
    };

    return (
        <Box sx={{ mb: 2, position: 'relative', height: '100%' }} fullWidth>
            {loading && <BackdropLoading />}
            <iframe
                ref={iframeRef}
                src={zoomPlayUrl}
                width="100%"
                height={850}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Meeting Video"
                style={{ border: 0 }}
                onLoad={handleIframeLoad}
            />
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '20%',  // Adjust the size to cover the logo
                height: '50px',  // Adjust the size to cover the logo
                backgroundColor: 'white'  // Or any color that matches the iframe background
            }}></Box>
        </Box>
    );
}

export default ViewRecording;
