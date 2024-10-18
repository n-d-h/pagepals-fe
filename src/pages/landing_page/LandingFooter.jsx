import { Box } from "@mui/material";
import Iconify from "../../components/iconify";
import React from "react";

const LandingFooter = () => {
	return (
		<Box
			sx={{
				// bgcolor: "darkslategray",
				// background: "linear-gradient(90deg, darkslategray, #1DBF73)",
				backgroundColor: 'white',
				borderTop: '3px solid',
				borderColor: '#1DBF73',
				width: "100%",
				height: "6vh",
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				px: 8,
				pt: 1,
				pb: 1,
				m: 0,
			}}
			component="footer"
		>
			<Box sx={{ color: "darkslategray", fontWeight: 600 }}>© 2024 PagePals</Box>
			<Box sx={{ color: "#000" }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-start",
						alignItems: "center",
						gap: 2,
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							p: 1,
							borderRadius: "50%",
							bgcolor: "GrayText",
							transition: "all 0.3s ease-in-out",
							":hover": {
								bgcolor: "#2D2D2D",
								cursor: "pointer",
							},
						}}
					>
						<Iconify
							icon="fa6-brands:instagram"
							width={20}
							sx={{
								color: "white",
							}}
						/>
					</Box>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							p: 1,
							borderRadius: "50%",
							bgcolor: "GrayText",
							transition: "all 0.3s ease-in-out",
							":hover": {
								bgcolor: "#2D2D2D",
								cursor: "pointer",
							},
						}}
					>
						<Iconify
							icon="icon-park-outline:dribble"
							width={20}
							sx={{
								color: "white",
							}}
						/>
					</Box>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							p: 1,
							borderRadius: "50%",
							bgcolor: "GrayText",
							transition: "all 0.3s ease-in-out",
							":hover": {
								bgcolor: "#2D2D2D",
								cursor: "pointer",
							},
						}}
					>
						<Iconify
							icon="icon-park-outline:big-x"
							width={20}
							sx={{
								color: "white",
							}}
						/>
					</Box>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							p: 1,
							borderRadius: "50%",
							bgcolor: "GrayText",
							transition: "all 0.3s ease-in-out",
							":hover": {
								bgcolor: "#2D2D2D",
								cursor: "pointer",
							},
						}}
					>
						<Iconify
							icon="formkit:facebook"
							width={20}
							sx={{
								color: "white",
							}}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

const MemoizedLandingFooter = React.memo(LandingFooter);
export default MemoizedLandingFooter;
