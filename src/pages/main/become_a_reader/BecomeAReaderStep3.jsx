import { useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { m } from 'framer-motion';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { varBounce } from '../../../components/animate/variants';
import { handleFriendlyError } from '../../../components/common_services/CommonServices';
import RHFTextField from '../../../components/hook-form/rhf-text-field';
import { useResponsive } from '../../../components/hooks/use-responsive';
import Iconify from '../../../components/iconify';
import { getListQuestions } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';

const BecomeAReaderStep3 = (props) => {
  const {
    control,
    setValue,
    watch,
    trigger,
  } = useFormContext();
  const mdUp = useResponsive('up', 'md');

  const { data: questions, loading } = useQuery(getListQuestions, {
    onError: (e) => {
      handleFriendlyError(e, 'Cannot fetch questions');
    },
  });

  const listQuestions = questions?.getListQuestion || [];

  const checkValid = () => {
    if (watch('answers')) {
      return true;
    }
    trigger('answers');
    return false;
  };

  if (loading) {
    return <BackdropLoading />;
  }

  return (
		<Box
			sx={{
			  width: '100%',
			  height: '100%',
			}}
		>
			<m.div
				variants={varBounce().in}
				style={{
				  width: '100%',
				  height: '100%',
				  display: 'flex',
				  alignItems: 'center',
				  justifyContent: 'center',
				}}
			>
				<Paper
					sx={{
					  display: 'flex',
					  flexDirection: 'column',
					  alignItems: 'center',
					  width: mdUp ? '50%' : '100%',
					  height: 'fit-content',
					  p: 5,
					  borderRadius: 4,
					}}
					elevation={4}
				>
					<Typography variant="h4" fontWeight={200}>
						{'Some questions for you!'}
					</Typography>

					<Grid
						container
						spacing={4}
						sx={{
						  width: '100%',
						  my: 1,
						}}
					>
						<Grid item xs={12}>
							<Typography variant="body2" fontWeight={200} gutterBottom>
								{listQuestions[0]?.content}
							</Typography>
							<RHFTextField
								name="answers"
								control={control}
								label={'Answer here'}
								multiline
								rows={3}
								value={watch('answers[0].content')}
								required
								onChange={(e) => {
								  setValue('answers[0].content', e.target.value);
								  setValue('answers[0].questionId', listQuestions[0]?.id);
								  trigger('answers');
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							{' '}
							<Typography variant="body2" fontWeight={200} gutterBottom>
								{listQuestions[1]?.content}
							</Typography>
							<RHFTextField
								name="answers"
								control={control}
								label={'Answer here'}
								multiline
								required
								rows={3}
								value={watch('answers[1].content')}
								onChange={(e) => {
								  setValue('answers[1].content', e.target.value);
								  setValue('answers[1].questionId', listQuestions[1]?.id);
								  trigger('answers');
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body2" fontWeight={200} gutterBottom>
								{listQuestions[2]?.content}
							</Typography>
							<RHFTextField
								name="answers"
								control={control}
								label={'Answer here'}
								multiline
								required
								rows={3}
								value={watch('answers[2].content')}
								onChange={(e) => {
								  setValue('answers[2].content', e.target.value);
								  setValue('answers[2].questionId', listQuestions[2]?.id);
								  trigger('answers');
								}}
							/>
						</Grid>
					</Grid>

					<Box
						sx={{
						  width: '100%',
						  display: 'flex',
						  justifyContent: 'center',
						  gap: 2,
						  mt: 2,
						}}
					>
						<Button
							variant="outlined"
							color="primary"
							size="large"
							onClick={() => {
							  props.handleBack();
							}}
							startIcon={<Iconify icon="akar-icons:arrow-left" />}
						>
							{'Back'}
						</Button>
						<Button
							variant="contained"
							color="primary"
							size="large"
							onClick={() => {
							  if (checkValid()) {
							    props.handleNext();
							  }
							}}
							endIcon={<Iconify icon="akar-icons:arrow-right" />}
						>
							{'Continue'}
						</Button>
					</Box>
				</Paper>
			</m.div>
		</Box>
  );
};

export default BecomeAReaderStep3;
