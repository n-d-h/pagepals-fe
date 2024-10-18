import { mt } from "date-fns/locale";
import Editor from "../../../../../components/editor/editor";
import { Box } from "@mui/material";

export default function CreateStep3({ description, setDescription }) {
    return (
        <Box sx={{ mt: 3 }}>
            <Editor
                id="full-editor"
                initialValue={description}
                setValue={setDescription}
            />
        </Box>
    )
};