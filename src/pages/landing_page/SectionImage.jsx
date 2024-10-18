import { Box, Button, Grid, Typography, Stack } from "@mui/material";
import Iconify from "../../components/iconify";
import visualLanding from "../../assets/landing/landingVisual.png";
import { useNavigate } from "react-router";
import { useResponsive } from "../../components/hooks/use-responsive";

const SectionImage = () => {
	const navigate = useNavigate();

	const mdUp = useResponsive("up", "md");

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				py: mdUp ? 10 : 5,
			}}
		>
			<Grid
				container
				flexDirection={!mdUp && "column-reverse"}
				spacing={!mdUp && 4}
			>
				<Grid item xs={12} md={6}>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: !mdUp && "center",
							height: "100%",
							gap: mdUp ? 2 : 4,
							pl: mdUp ? 20 : 4,
							pr: !mdUp && 4,
						}}
					>
						<Box>
							<Typography variant={mdUp ? "h1" : "h2"} component="div">
								Connect with Reader
							</Typography>
						</Box>

						<Box>
							<Typography
								variant="h6"
								fontWeight={400}
								component="div"
								textAlign={!mdUp && "center"}
							>
								A knowledge-expanding platform by connecting people with
								well-informed book readers via online Web and Video Conferencing
								Call
							</Typography>
						</Box>

						{mdUp && (
							<Box>
								<Button
									variant="contained"
									startIcon={<Iconify icon="ion:rocket-outline" width={24} />}
									sx={{
										mr: 2,
									}}
									color="primary"
									onClick={() => {
										navigate("/auth/register");
									}}
								>
									Sign Up
								</Button>

								<Button
									variant="outlined"
									color="primary"
									onClick={() => {
										navigate("/auth/login");
									}}
								>
									Sign In
								</Button>
							</Box>
						)}
					</Box>
				</Grid>

				<Grid item xs={12} md={6}>
					<Stack
						flexGrow={1}
						spacing={5}
						alignItems="center"
						justifyContent="center"
					>
						<Box
							component="img"
							alt="auth"
							src={visualLanding}
							sx={{
								maxWidth: {
									xs: 320,
									lg: 560,
									xl: 720,
								},
							}}
						/>
					</Stack>
				</Grid>
			</Grid>
		</Box>
	);
};

export default SectionImage;
