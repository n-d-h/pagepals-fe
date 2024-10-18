/* eslint-disable no-unused-vars */
import { Box, Button, Grid, Typography } from "@mui/material";
import Iconify from "../../components/iconify";
import profilePicture1 from "../../assets/landing/photo1.png";
import profilePicture2 from "../../assets/landing/photo2.png";
import profilePicture3 from "../../assets/landing/photo3.png";
import { useResponsive } from "../../components/hooks/use-responsive";

const REVIEWS = [
	{
		name: "Sarah K.",
		role: "UX Designer @Brello",
		review:
			"I was looking for a way to streamline my design process and the Anima’s Landing Page UI Kit was a lifesaver! The intuitive design and ease of customisation have saved me hours of time and effort. Highly recommend!",
		star: 5,
		profilePicture: profilePicture1,
	},
	{
		name: "Michael L.",
		role: "Creative Director @Yo",
		review:
			"The Landing Page UI Kit has been a game changer for my agency.The pre- designed components and templates have helped us deliver projects faster and with more consistency.Great job!",
		star: 4,
		profilePicture: profilePicture2,
	},
	{
		name: "Lauren M.",
		role: "UI Designer @Boo",
		review:
			"Anima’s Landing Page UI Kit has become a staple in my design toolkit. Whether I'm working on a new project or need to make updates to an existing one, this kit has everything I need to get the job done quickly and efficiently.",
		star: 5,
		profilePicture: profilePicture3,
	},
];

const SectionFeedback = () => {
	const mdUp = useResponsive("up", "md");

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				py: mdUp ? 10 : 2,
				flexDirection: "column",
				gap: 2,
			}}
		>
			<Typography variant="h3" component="div">
				Real Stories from Our Customers
			</Typography>

			<Typography
				variant="h6"
				fontWeight={400}
				component="div"
				textAlign={!mdUp && "center"}
			>
				See how our website make an impact
			</Typography>

			<Box
				sx={{
					mt: 5,
				}}
			>
				<Grid container spacing={12}>
					{REVIEWS.map((review, index) => (
						<Grid
							item
							xs={12}
							md={4}
							key={index}
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									gap: mdUp ? 2 : 1,
									maxWidth: mdUp ? 400 : 300,
									bgcolor: "background.paper",
									borderRadius: 6,
									p: 2,
									minHeight: mdUp ? 400 : 300,
								}}
							>
								<Box
									component="img"
									alt="auth"
									src={review.profilePicture}
									sx={{
										width: {
											xs: 75,
											md: 100,
										},
										height: {
											xs: 75,
											md: 100,
										},
										borderRadius: "50%",
									}}
								/>

								<Typography variant={mdUp ? "h3" : "h5"} component="div" mt={2}>
									{review.name}
								</Typography>

								<Typography
									variant="body1"
									fontWeight={300}
									color={"GrayText"}
									component="div"
									mt={mdUp ? -2 : -1}
								>
									{review.role}
								</Typography>

								<Typography
									variant={mdUp ? "body1" : "body2"}
									fontWeight={400}
									component="div"
									textAlign={"center"}
									px={2}
								>
									{review.review}
								</Typography>

								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										gap: 1,
										mt: 2,
									}}
								>
									{[...Array(review.star)].map((e, i) => (
										<Iconify
											key={i}
											icon="ion:star"
											color="#f5b301"
											width={24}
										/>
									))}
								</Box>
							</Box>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
	);
};

export default SectionFeedback;
