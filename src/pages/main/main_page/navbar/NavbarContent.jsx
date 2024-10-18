import { Box, Typography } from "@mui/material";
import Iconify from "../../../../components/iconify";
import { paths } from "../../../../components/router/paths";

export const menuItems = [
	{
		title: (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Iconify icon="octicon:globe-16" width={24} height={24} />
				<Typography variant="body1">Home</Typography>
			</Box>
		),
		href: paths.main.root,
	},
	{
		title: (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Iconify icon="mingcute:search-fill" width={24} height={24} />
				<Typography variant="body1">Search</Typography>
			</Box>
		),
		href: paths.main.search,
	},
	{
		title: (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Iconify icon="ion:navigate-circle" width={24} height={24} />
				<Typography variant="body1">Browse</Typography>
			</Box>
		),
		href: paths.main.browse,
	},
	{
		title: (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Iconify icon="fluent:chat-12-regular" width={24} height={24} />
				<Typography variant="body1">Chat</Typography>
			</Box>
		),
		href: paths.main.chat,
	},
	{
		title: (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Iconify icon="ri:more-fill" width={24} height={24} />
				<Typography variant="body1">More</Typography>
			</Box>
		),
		subItems: [
			{
				title: "Stitches",
				href: "https://stitches.dev/",
				description: "CSS-in-JS with best-in-class developer experience.",
			},
			// ... other sub-items
		],
	},
	// ... other main items
];
