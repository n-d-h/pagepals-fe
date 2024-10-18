/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from '@mui/material';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import React from 'react';
import RouterLink from '../router/router-link';
import './ShadcnNavigationStyles.css';

const ShadcnNavigation = ({ menuItems }) => {
  return (
		<NavigationMenu.Root className="NavigationMenuRoot">
			<NavigationMenu.List className="NavigationMenuList">
				{menuItems.map((item) =>
				  item.subItems
				    ? (
						<NavigationMenu.Item key={item.title}>
							<NavigationMenu.Trigger className="NavigationMenuTrigger">
								{item.title}
							</NavigationMenu.Trigger>
							{item.subItems && (
								<NavigationMenu.Content className="NavigationMenuContent">
									<ul className="List">
										{item.subItems.map((subItem) => (
											<ListItem
												key={subItem.title}
												href={subItem.href}
												title={subItem.title}
											>
												{subItem.description}
											</ListItem>
										))}
									</ul>
								</NavigationMenu.Content>
							)}
						</NavigationMenu.Item>
				  )
				    : (
						<NavigationMenu.Item key={item.title}>
							<NavigationMenu.Trigger className="NavigationMenuTrigger">

							<Link
								component={RouterLink}
								href={item.href}
								color="inherit"
								underline="none"
							>
								<div className="ListItemHeading">{item.title}</div>
							</Link>
							</NavigationMenu.Trigger>
						</NavigationMenu.Item>
				  ),
				)}
				<NavigationMenu.Indicator className="NavigationMenuIndicator">
					<div className="Arrow" />
				</NavigationMenu.Indicator>
			</NavigationMenu.List>
			<div className="ViewportPosition">
				<NavigationMenu.Viewport className="NavigationMenuViewport" />
			</div>
		</NavigationMenu.Root>
  );
};

// eslint-disable-next-line react/display-name
const ListItem = React.forwardRef(
  ({ className, children, title, ...props }, forwardedRef) => (
		<li>
			<NavigationMenu.Link asChild>
				<Link
					component={RouterLink}
					href={forwardedRef}
					color="inherit"
					underline="none"
				>
					<div className="ListItemHeading">{title}</div>
					<p className="ListItemText">{children}</p>
				</Link>
			</NavigationMenu.Link>
		</li>
  ),
);

export default ShadcnNavigation;
