/* eslint-disable no-undef */
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { Box, Card, Tab, Tabs, tabsClasses } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Iconify from '../../../components/iconify/iconify';
import { selectUser } from '../../../redux/slices/authSlice';
import ProfileCover from './ProfileCover';
import ProfileEditForm from './ProfileEditForm';
import { PROFILE_TABS } from './TabEnum';
import PasswordForm from './password/PasswordForm';
import ProfileSchedule from './schedule/ProfileSchedule';
import ProfileWallet from './wallet/ProfileWallet';

const PersonalAccount = () => {
  const user = useSelector(selectUser);

  const [currentTab, setCurrentTab] = useState('edit');

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
		<>
			<Box
				sx={{
				  my: 3,
				  mx: 5,
				}}
			>
				<Card
					sx={{
					  mb: 3,
					  height: 290,
					}}
				>
					<ProfileCover
						avatarUrl={_.get(
						  user,
						  'customer.imageUrl',
						  'https://i.pravatar.cc/300?img=3',
						)}
						coverUrl={
							'https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.6435-9/109979117_996436930804930_4358947889348200449_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=300f58&_nc_ohc=_v83oE70eLcAX_MXVHq&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfCGq3g43I88o8QO0NiBEca_kJlsfnUymYfkE2qvLXf5uA&oe=65D55566'
						}
						key={_.get(user, 'username', 'Anonymous')}
						name={_.get(user, 'username', 'Anonymous')}
						role={_.get(user, 'role.name', 'Anonymous')}
					/>

					<Tabs
						value={currentTab}
						onChange={handleChangeTab}
						centered
						sx={{
						  width: 1,
						  bottom: 0,
						  zIndex: 9,
						  position: 'absolute',
						  bgcolor: 'background.paper',
						  [`& .${tabsClasses.flexContainer}`]: {
						    pr: { md: 3 },
						    justifyContent: {
						      sm: 'center',
						      md: 'flex-end',
						    },
						  },
						}}
					>
						{PROFILE_TABS.map((tab) => (
							<Tab
								key={tab.value}
								value={tab.value}
								icon={<Iconify icon={tab.icon} />}
								label={tab.label}
							/>
						))}
					</Tabs>
				</Card>

				{currentTab === 'edit' && <ProfileEditForm currentUser={user} />}

				{currentTab === 'password' && <PasswordForm/> }

				{currentTab === 'wallet' && <ProfileWallet />}

				{currentTab === 'meeting' && <ProfileSchedule />}
			 </Box>
		</>
  );
};

export default PersonalAccount;
