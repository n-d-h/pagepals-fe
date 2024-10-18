import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import mockup from "../../assets/landing/mockup.png";
import Iconify from "../../components/iconify";
import { useNavigate } from "react-router";
import { useResponsive } from "../../components/hooks/use-responsive";

const SectionGetStarted = () => {
	const navigate = useNavigate();

	const mdUp = useResponsive("up", "md");

	return (
		<Box
			sx={{
				pt: 8,
				pb: 6,
			}}
		>
			<Box
				sx={{
					bgcolor: "#F2BFAF",
					mx: mdUp ? 20 : 5,
					borderRadius: 6,
					px: 0,
				}}
			>
				<Grid container>
					<Grid item xs={12} md={6}>
						<Container
							maxWidth="lg"
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: mdUp ? "flex-start" : "center",
								py: mdUp ? 10 : 5,
								ml: mdUp && 5,
								height: "100%",
							}}
						>
							<Typography
								variant={mdUp ? "h1" : "h2"}
								fontWeight={800}
								component="div"
								gutterBottom
								align={"center"}
							>
								Become a Reader
							</Typography>

							<Typography
								variant="h3"
								fontWeight={200}
								component="div"
								textAlign={!mdUp && "center"}
							>
								Start meeting and reading to share your knowledge now !
							</Typography>

							<Box
								sx={{
									mt: 6,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									gap: 2,
								}}
							>
								<Button
									variant="contained"
									color="primary"
									size="large"
									sx={{
										borderRadius: 2,
										px: 5,
										py: 4,
										fontWeight: 600,
										fontSize: 18,
									}}
									endIcon={
										<Iconify icon="ion:chevron-forward-outline" width={24} />
									}
									onClick={() => {
										navigate("/auth/login");
									}}
								>
									Get Started
								</Button>
							</Box>
						</Container>
					</Grid>

					{mdUp && (
						<Grid item xs={12} md={6}>
							<Stack alignItems="center" justifyContent="center">
								<Box
									component="img"
									alt="auth"
									src={mockup}
									sx={{
										width: "100%",
									}}
								/>
							</Stack>
						</Grid>
					)}
				</Grid>
			</Box>
		</Box>
	);
};

export default SectionGetStarted;
