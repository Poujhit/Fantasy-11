import Head from 'next/head';
import React from 'react';
import {
	Button,
	Card,
	Snackbar,
	TextField,
	Typography,
} from '@material-ui/core';
import FacebookLogin from 'react-facebook-login';

import classes from '../../styles/Login.module.scss';
import styles from '../../styles/Home.module.scss';
import { Field, Form, Formik } from 'formik';
import { useMutation } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import HashLoader from 'react-spinners/HashLoader';
import PopUpDialog from '../../components/Dialog';
import { useRouter } from 'next/router';
import userDataStore from '../../stores/UserDataStore';

interface RegisterUser {
	email: string;
	phone: string;
	password: string;
}
interface AuthServerResponse {
	phone: string;
	email: string;
}

const RegisterScreen: React.FC = () => {
	const initialValues: RegisterUser = {
		email: '',
		phone: '',
		password: '',
	};

	const responseFacebook = (response: any) => {
		console.log(response);
	};

	const router = useRouter();

	const userData = userDataStore((state) => state);

	const [openDialog, setOpenDialog] = React.useState(false);
	const [openAlert, setOpenAlert] = React.useState(false);
	const [snackContent, setsnackContent] = React.useState(' ');

	// const handleCloseDialog = () => {
	// 	setOpenDialog(false);
	// };

	const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenAlert(false);
	};

	const mutation = useMutation((newUser: RegisterUser) => {
		return axios.post('http://localhost:4000/api/users/register/', {
			...newUser,
		});
	});

	return (
		<React.Fragment>
			<Head>
				<title>Fantasy 11 | Register</title>
			</Head>
			<div className={classes.background}>
				<Card
					className={classes.Card}
					variant='elevation'
					raised
					style={{
						borderRadius: '20px',
					}}
				>
					<div className={classes.leftPortionCard}>
						<Typography
							className={styles.title}
							style={{
								color: 'white',
							}}
						>
							Register
						</Typography>
					</div>
					<div className={classes.rightPortionCard}>
						<FacebookLogin
							appId='801446123894360'
							callback={responseFacebook}
							fields='id,email,name'
						/>
						<Typography
							className={styles.title}
							style={{
								fontSize: '20px',
								marginTop: '2%',
							}}
						>
							Or
						</Typography>
						<Formik
							validateOnChange={true}
							initialValues={initialValues}
							validate={(values) => {
								const errors: Record<string, string> = {};
								const regexpEmail = new RegExp(
									/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
								);
								const regexPhone = new RegExp(/^[6-9]\d{9}$/);

								if (!regexpEmail.test(values.email))
									errors.email = 'Email Invalid';
								if (values.password.length <= 6)
									errors.password = 'Password length should be greater than 6.';
								if (!regexPhone.test(values.phone))
									errors.phone = 'Phone Number Invalid';
								return errors;
							}}
							onSubmit={(values, actions) => {
								actions.setSubmitting(true);

								mutation
									.mutateAsync(values)
									.then((value: AxiosResponse<AuthServerResponse>) => {
										userData.setEmail(value.data.email);
										userData.setphone(value.data.phone);
										setOpenDialog(true);
									})
									.catch((error) => {
										setsnackContent(error.toString());
										setOpenAlert(true);
									});

								actions.setSubmitting(false);
							}}
						>
							{({ isSubmitting, errors }) => (
								<Form
									style={{
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										alignItems: 'center',
										width: '80%',
										height: '70%',
									}}
								>
									<Field
										variant='outlined'
										style={{
											marginBottom: '20px',
										}}
										type='input'
										autoFocus={true}
										name='email'
										fullWidth
										label='Email'
										error={!!errors.email}
										helperText={errors.email}
										as={TextField}
									/>
									<Field
										variant='outlined'
										type='phone'
										fullWidth
										style={{
											marginBottom: '20px',
										}}
										error={!!errors.phone}
										label='Phone Number'
										helperText={errors.phone}
										name='phone'
										as={TextField}
									/>
									<Field
										variant='outlined'
										type='password'
										fullWidth
										style={{
											marginBottom: '20px',
										}}
										error={!!errors.password}
										label='Password'
										helperText={errors.password}
										name='password'
										as={TextField}
									/>
									<Button
										disabled={isSubmitting}
										className={classes.Button}
										style={{
											border: '2px solid red',
										}}
										type='submit'
									>
										{mutation.isLoading ? (
											<HashLoader
												loading={mutation.isLoading}
												size={35}
												color='black'
											/>
										) : (
											'submit'
										)}
									</Button>
								</Form>
							)}
						</Formik>
					</div>
				</Card>
			</div>
			<PopUpDialog
				open={openDialog}
				content={'You are Registered.Click on OK button to Login.'}
				title={'Done!'}
				okButtonText={'OK'}
				onOkHandled={() => {
					console.log('done');
					router.replace('/login');
				}}
			/>
			<Snackbar
				open={openAlert}
				autoHideDuration={3000}
				onClose={handleClose}
				message={snackContent}
				action={
					<Button onClick={handleClose} style={{ color: 'white' }}>
						Close
					</Button>
				}
			/>
		</React.Fragment>
	);
};

export default RegisterScreen;
